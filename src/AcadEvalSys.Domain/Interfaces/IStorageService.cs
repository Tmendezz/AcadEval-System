namespace AcadEvalSys.Domain.Interfaces;

public interface IStorageService
{
    /// <summary>
    /// Sube un archivo y retorna el nombre del blob (no la URL)
    /// </summary>
    Task<string> UploadFileAsync(string fileName, Stream stream);
    
    /// <summary>
    /// Genera una URL firmada temporalmente para acceso seguro
    /// </summary>
    Task<string> GeneratePresignedUrlAsync(string blobName, string containerName, TimeSpan expiration);
    
    /// <summary>
    /// Genera una URL temporal para reportes (24 horas de validez)
    /// </summary>
    Task<string> GetReportUrlAsync(string blobName);
    
    /// <summary>
    /// Descarga un archivo como array de bytes
    /// </summary>
    Task<byte[]> DownloadFileAsync(string fileName, string bucketName);
    
    /// <summary>
    /// Elimina un archivo del storage
    /// </summary>
    Task<bool> DeleteFileAsync(string fileName, string bucketName);
    
    /// <summary>
    /// Obtiene URL pública (obsoleto para URLs privadas)
    /// </summary>
    [Obsolete("Use GeneratePresignedUrlAsync instead for private storage")]
    Task<string> GetPublicUrlAsync(string blobUrl);
}