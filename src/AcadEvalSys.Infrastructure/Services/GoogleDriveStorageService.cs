using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Configuration;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AcadEvalSys.Infrastructure.Services;

/// <summary>
/// Implementación alternativa de IStorageService usando Google Drive.
/// Sube PDFs a una carpeta de Drive, permite descargar/borrar y genera enlaces compartidos temporales.
/// </summary>
public class GoogleDriveStorageService : IStorageService
{
	private readonly GoogleDriveStorageConfiguration _config;
	private readonly ILogger<GoogleDriveStorageService> _logger;
	private readonly DriveService _drive;

	public GoogleDriveStorageService(
		IOptions<GoogleDriveStorageConfiguration> config,
		ILogger<GoogleDriveStorageService> logger)
	{
		_config = config.Value;
		_logger = logger;

		GoogleCredential credential = GoogleCredential
			.FromFile(_config.ServiceAccountCredentialsPath)
			.CreateScoped(DriveService.ScopeConstants.Drive);

		_drive = new DriveService(new BaseClientService.Initializer
		{
			HttpClientInitializer = credential,
			ApplicationName = "AcadEvalSys"
		});
	}

	public async Task<string> UploadFileAsync(string fileName, Stream stream)
	{
		// Validaciones tamaño/tipo
		if (stream.Length > _config.MaxFileSizeBytes)
			throw new InvalidOperationException($"File size ({stream.Length} bytes) exceeds maximum allowed size ({_config.MaxFileSizeBytes} bytes)");

		var ext = Path.GetExtension(fileName);
		if (!_config.IsFileTypeAllowed(ext))
			throw new InvalidOperationException($"File type '{ext}' is not allowed.");

		// Soportar rutas con '/' para crear carpetas dinámicas
		var pathSegments = fileName.Replace("\\", "/").Split('/', StringSplitOptions.RemoveEmptyEntries);
		var finalName = pathSegments.Length > 0 ? pathSegments[^1] : Path.GetFileName(fileName);
		var parentId = await EnsureFolderPathAsync(pathSegments.SkipLast(1).ToArray());

		// Log de intención de subida (ruta lógica y carpeta destino)
		var logicalPath = string.Join('/', pathSegments);
		var effectiveParent = string.IsNullOrWhiteSpace(parentId)
			? (string.IsNullOrWhiteSpace(_config.FolderId) ? "root" : _config.FolderId!)
			: parentId;
		var contentType = GetContentType(ext);


		var fileMetadata = new Google.Apis.Drive.v3.Data.File
		{
			Name = finalName,
			Parents = string.IsNullOrWhiteSpace(parentId) ? (string.IsNullOrWhiteSpace(_config.FolderId) ? null : new[] { _config.FolderId! }) : new[] { parentId }
		};

		var request = _drive.Files.Create(fileMetadata, stream, contentType);
		request.Fields = "id, name, mimeType, parents";
		request.SupportsAllDrives = true;
		var upload = await request.UploadAsync();
		if (upload.Exception != null)
		{
			_logger.LogError(upload.Exception, "Error uploading file to Google Drive: {FileName}", fileName);
			throw upload.Exception;
		}

		var driveFile = request.ResponseBody;
		if (driveFile == null || string.IsNullOrEmpty(driveFile.Id))
			throw new InvalidOperationException("Google Drive did not return a file id");

		_logger.LogInformation("File uploaded to Google Drive: {Name} (Id: {Id})", driveFile.Name, driveFile.Id);

		// Devolvemos el Id del archivo como "blobName"
		return driveFile.Id;
	}

	public async Task<string> GeneratePresignedUrlAsync(string blobName, string containerName, TimeSpan expiration)
	{
		// Google Drive no soporta "pre-signed" URLs al estilo Azure/AWS.
		// Estrategia: crear un permiso de tipo "anyone with the link" (reader) si no existe
		// y retornar la webViewLink/webContentLink. Para vencimiento, se podría programar
		// un job que remueva el permiso cuando expire.

		var getReq = _drive.Files.Get(blobName);
		getReq.SupportsAllDrives = true;
		var file = await getReq.ExecuteAsync();
		if (file == null) throw new FileNotFoundException($"Drive file '{blobName}' not found");

		// Crear permiso público de solo lectura si aún no está compartido
		await EnsurePublicReadPermission(blobName);

		// Intentar obtener webContentLink (descarga directa) o webViewLink
		// Nota: webContentLink se obtiene cuando el tipo permite descarga directa.
		var refreshedReq = _drive.Files.Get(blobName);
		refreshedReq.SupportsAllDrives = true;
		var refreshed = await refreshedReq.ExecuteAsync();
		return refreshed.WebContentLink ?? refreshed.WebViewLink ?? $"https://drive.google.com/file/d/{blobName}/view";
	}

	public async Task<string> GetReportUrlAsync(string blobName)
	{
		// Delegar a GeneratePresignedUrlAsync con una "expiración lógica" de 24h
		return await GeneratePresignedUrlAsync(blobName, _config.FolderId ?? string.Empty, TimeSpan.FromHours(24));
	}

	public async Task<byte[]> DownloadFileAsync(string fileName, string bucketName)
	{
		using var ms = new MemoryStream();
		var request = _drive.Files.Get(fileName);
		request.SupportsAllDrives = true;
		await request.DownloadAsync(ms);
		return ms.ToArray();
	}

	public async Task<bool> DeleteFileAsync(string fileName, string bucketName)
	{
		try
		{
			await _drive.Files.Delete(fileName).ExecuteAsync();
			_logger.LogInformation("Drive file deleted: {FileId}", fileName);
			return true;
		}
		catch (Google.GoogleApiException ex) when (ex.Error.Code == 404)
		{
			_logger.LogWarning("Drive file not found for deletion: {FileId}", fileName);
			return false;
		}
	}

	[Obsolete("Google Drive URLs are handled via sharing links. Prefer GeneratePresignedUrlAsync.")]
	public Task<string> GetPublicUrlAsync(string blobUrl)
	{
		return Task.FromResult(blobUrl);
	}

	private async Task EnsurePublicReadPermission(string fileId)
	{
		// Revisa si ya existe un permiso "anyone"
		var perms = await _drive.Permissions.List(fileId).ExecuteAsync();
		if (perms.Permissions != null && perms.Permissions.Any(p => p.Type == "anyone" && p.Role == "reader"))
			return;

		var permission = new Permission
		{
			Type = "anyone",
			Role = "reader",
			AllowFileDiscovery = false,
		};
		var permReq = _drive.Permissions.Create(permission, fileId);
		permReq.SupportsAllDrives = true;
		await permReq.ExecuteAsync();
	}

	private async Task<string> EnsureFolderPathAsync(string[] segments)
	{
		if (segments.Length == 0) return _config.FolderId ?? string.Empty;

		string parentId = _config.FolderId ?? "root";
		foreach (var raw in segments)
		{
			var name = raw.Trim();
			if (string.IsNullOrWhiteSpace(name)) continue;

			// Buscar carpeta por nombre bajo el parent
		var listReq = _drive.Files.List();
			listReq.Q = $"mimeType = 'application/vnd.google-apps.folder' and name = '{name.Replace("'", "\\'")}' and '{parentId}' in parents and trashed = false";
			listReq.Fields = "files(id, name, parents)";
			listReq.SupportsAllDrives = true;
			listReq.IncludeItemsFromAllDrives = true;
			var list = await listReq.ExecuteAsync();
			var found = list.Files?.FirstOrDefault();
			if (found != null)
			{
				parentId = found.Id;
				continue;
			}

			// Crear carpeta
			var folder = new Google.Apis.Drive.v3.Data.File
			{
				Name = name,
				MimeType = "application/vnd.google-apps.folder",
				Parents = new[] { parentId }
			};
			var createReq = _drive.Files.Create(folder);
			createReq.Fields = "id, name";
			createReq.SupportsAllDrives = true;
			var created = await createReq.ExecuteAsync();
			parentId = created.Id;
		}

		return parentId;
	}

	private static string GetContentType(string ext)
	{
		return ext.ToLowerInvariant() switch
		{
			".pdf" => "application/pdf",
			_ => "application/octet-stream"
		};
	}
}


