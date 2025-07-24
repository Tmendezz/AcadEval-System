using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Configuration;

namespace AcadEvalSys.Infrastructure.Services;

public class StorageService : IStorageService
{
    private readonly StorageConfiguration _storageConfiguration;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly ILogger<StorageService> _logger;

    public StorageService(IOptions<StorageConfiguration> storageConfiguration, ILogger<StorageService> logger)
    {
        _storageConfiguration = storageConfiguration.Value;
        _logger = logger;
        _blobServiceClient = new BlobServiceClient(_storageConfiguration.ConnectionString);
    }

    public async Task<string> UploadFileAsync(string fileName, Stream stream)
    {
        try
        {
            // Validar tamaño del archivo
            if (stream.Length > _storageConfiguration.MaxFileSizeBytes)
            {
                throw new InvalidOperationException($"File size ({stream.Length} bytes) exceeds maximum allowed size ({_storageConfiguration.MaxFileSizeBytes} bytes)");
            }

            // Validar tipo de archivo
            var fileExtension = Path.GetExtension(fileName);
            if (!_storageConfiguration.IsFileTypeAllowed(fileExtension))
            {
                throw new InvalidOperationException($"File type '{fileExtension}' is not allowed. Allowed types: {string.Join(", ", _storageConfiguration.AllowedFileTypes)}");
            }

            // Generar nombre único para evitar conflictos
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            
            // Obtener el contenedor - AHORA PRIVADO
            var containerClient = _blobServiceClient.GetBlobContainerClient(_storageConfiguration.ReportsContainerName);
            
            // Crear el contenedor PRIVADO si no existe
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.None); // ← CAMBIO CLAVE
            
            // Obtener el blob client
            var blobClient = containerClient.GetBlobClient(uniqueFileName);
            
            // Configurar headers para el tipo de contenido
            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = GetContentType(fileExtension)
            };
            
            // Subir el archivo
            var uploadResult = await blobClient.UploadAsync(
                stream, 
                new BlobUploadOptions 
                { 
                    HttpHeaders = blobHttpHeaders,
                });

            _logger.LogInformation("File uploaded successfully: {FileName} -> {BlobName}", fileName, uniqueFileName);
            
            // RETORNAR SOLO EL NOMBRE DEL BLOB, NO LA URL
            return uniqueFileName; // ← CAMBIO CLAVE
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName}", fileName);
            throw;
        }
    }

    // NUEVO MÉTODO: Generar URL firmada temporalmente
    public async Task<string> GeneratePresignedUrlAsync(string blobName, string containerName, TimeSpan expiration)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            // Verificar que el blob existe
            if (!await blobClient.ExistsAsync())
            {
                throw new FileNotFoundException($"Blob '{blobName}' not found in container '{containerName}'");
            }

            // Verificar que el cliente puede generar SAS
            if (!blobClient.CanGenerateSasUri)
            {
                throw new InvalidOperationException("BlobClient must be authenticated with account key to generate SAS token");
            }

            // Generar SAS token
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerName,
                BlobName = blobName,
                Resource = "b", // blob
                ExpiresOn = DateTimeOffset.UtcNow.Add(expiration)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasUri = blobClient.GenerateSasUri(sasBuilder);
            
            _logger.LogDebug("Generated presigned URL for blob {BlobName}, expires at {ExpiresOn}", 
                blobName, sasBuilder.ExpiresOn);

            return sasUri.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating presigned URL for blob: {BlobName}", blobName);
            throw;
        }
    }

    // MÉTODO HELPER: Generar URL temporal para reportes (24 horas)
    public async Task<string> GetReportUrlAsync(string blobName)
    {
        return await GeneratePresignedUrlAsync(blobName, _storageConfiguration.ReportsContainerName, TimeSpan.FromHours(24));
    }

    public async Task<string> GetPublicUrlAsync(string blobUrl)
    {
        // En este caso, como estamos usando PublicAccessType.Blob, 
        // la URL ya es pública y accesible directamente
        return await Task.FromResult(blobUrl);
    }

    public async Task<bool> DeleteFileAsync(string fileName, string bucketName)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(bucketName);
            var blobClient = containerClient.GetBlobClient(fileName);
            
            var response = await blobClient.DeleteIfExistsAsync();
            
            if (response.Value)
            {
                _logger.LogInformation("File deleted successfully: {FileName} from {BucketName}", fileName, bucketName);
            }
            else
            {
                _logger.LogWarning("File not found for deletion: {FileName} from {BucketName}", fileName, bucketName);
            }
            
            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileName} from {BucketName}", fileName, bucketName);
            throw;
        }
    }

    public async Task<byte[]> DownloadFileAsync(string fileName, string bucketName)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(bucketName);
            var blobClient = containerClient.GetBlobClient(fileName);
            
            if (!await blobClient.ExistsAsync())
            {
                throw new FileNotFoundException($"File '{fileName}' not found in bucket '{bucketName}'");
            }
            
            var response = await blobClient.DownloadContentAsync();
            var content = response.Value.Content.ToArray();
            
            _logger.LogInformation("File downloaded successfully: {FileName} from {BucketName}, Size: {Size} bytes", 
                fileName, bucketName, content.Length);
            
            return content;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileName} from {BucketName}", fileName, bucketName);
            throw;
        }
    }

    private static string GetContentType(string fileExtension)
    {
        return fileExtension.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}
