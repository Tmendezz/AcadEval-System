using System.ComponentModel.DataAnnotations;

namespace AcadEvalSys.Infrastructure.Configuration;

public class StorageConfiguration
{
    public const string Section = "BlobStorage";
    
    [Required(ErrorMessage = "Connection string is required")]
    public string ConnectionString { get; set; } = null!;
    
    [Required(ErrorMessage = "Reports container name is required")]
    public string ReportsContainerName { get; set; } = "reports";
    
    [Range(1, 100, ErrorMessage = "Max file size must be between 1 and 100 MB")]
    public int MaxFileSizeMb { get; set; } = 5;
    
    public string[] AllowedFileTypes { get; set; } = { "pdf", "doc", "docx", "jpg", "jpeg", "png", "txt" };
    
    // Propiedades calculadas útiles
    public long MaxFileSizeBytes => MaxFileSizeMb * 1024 * 1024;
    
    public bool IsFileTypeAllowed(string fileExtension)
    {
        if (string.IsNullOrWhiteSpace(fileExtension))
            return false;
            
        var extension = fileExtension.TrimStart('.').ToLowerInvariant();
        return AllowedFileTypes.Contains(extension);
    }
    
    // Método para validar que la configuración es correcta
    public bool IsValid()
    {
        if (string.IsNullOrWhiteSpace(ConnectionString))
            return false;
            
        // Verificar que el ConnectionString contiene los elementos necesarios
        return ConnectionString.Contains("AccountName=") && 
               ConnectionString.Contains("AccountKey=");
    }
}
