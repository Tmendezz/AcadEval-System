using System.ComponentModel.DataAnnotations;

namespace AcadEvalSys.Infrastructure.Configuration;

public class GoogleDriveStorageConfiguration
{
	public const string Section = "GoogleDriveStorage";

	/// <summary>
	/// Ruta al archivo JSON de credenciales del Service Account de Google.
	/// Puede ser una ruta relativa o absoluta. Si se define la variable de entorno
	/// GOOGLE_DRIVE_CREDENTIALS_PATH, esta propiedad será ignorada.
	/// </summary>
	public string ServiceAccountCredentialsPath { get; set; } = string.Empty;

	/// <summary>
	/// ID de la carpeta de Google Drive donde se guardarán los archivos (opcional).
	/// </summary>
	public string? FolderId { get; set; }

	/// <summary>
	/// Tamaño máximo de archivo en MB.
	/// </summary>
	[Range(1, 100, ErrorMessage = "Max file size must be between 1 and 100 MB")]
	public int MaxFileSizeMb { get; set; } = 5;

	/// <summary>
	/// Tipos de archivo permitidos (sin punto, en minúsculas).
	/// </summary>
	public string[] AllowedFileTypes { get; set; } = { "pdf" };

	public long MaxFileSizeBytes => MaxFileSizeMb * 1024L * 1024L;

	public bool IsFileTypeAllowed(string fileExtension)
	{
		if (string.IsNullOrWhiteSpace(fileExtension)) return false;
		var extension = fileExtension.TrimStart('.').ToLowerInvariant();
		return AllowedFileTypes.Contains(extension);
	}
}


