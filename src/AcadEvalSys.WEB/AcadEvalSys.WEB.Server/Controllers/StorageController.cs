using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("storage")]
[Authorize]
public class StorageController(
    IStorageService storageService,
    IOptions<StorageConfiguration> storageConfig,
    ILogger<StorageController> logger)
    : ControllerBase
{
    private readonly StorageConfiguration _storageConfig = storageConfig.Value;

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "No file was uploaded" });
        }

        try
        {
            using var stream = file.OpenReadStream();
            var fileUrl = await storageService.UploadFileAsync(file.FileName, stream);
            
            return Ok(new 
            { 
                message = "File uploaded successfully",
                fileName = file.FileName,
                fileUrl = fileUrl,
                fileSize = file.Length
            });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid file upload attempt: {FileName}", file.FileName);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
            return StatusCode(500, new { error = "Internal server error occurred while uploading file" });
        }
    }

    [HttpGet("download/{bucketName}/{fileName}")]
    public async Task<IActionResult> DownloadFile(string bucketName, string fileName)
    {
        try
        {
            var fileContent = await storageService.DownloadFileAsync(fileName, bucketName);
            var contentType = GetContentType(fileName);
            
            return File(fileContent, contentType, fileName);
        }
        catch (FileNotFoundException ex)
        {
            logger.LogWarning(ex, "File not found: {FileName} in {BucketName}", fileName, bucketName);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error downloading file: {FileName} from {BucketName}", fileName, bucketName);
            return StatusCode(500, new { error = "Internal server error occurred while downloading file" });
        }
    }

    [HttpDelete("{bucketName}/{fileName}")]
    public async Task<IActionResult> DeleteFile(string bucketName, string fileName)
    {
        try
        {
            var deleted = await storageService.DeleteFileAsync(fileName, bucketName);
            
            if (deleted)
            {
                return Ok(new { message = "File deleted successfully", fileName, bucketName });
            }
            else
            {
                return NotFound(new { error = "File not found", fileName, bucketName });
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting file: {FileName} from {BucketName}", fileName, bucketName);
            return StatusCode(500, new { error = "Internal server error occurred while deleting file" });
        }
    }

    [HttpGet("config")]
    public IActionResult GetStorageConfig()
    {
        return Ok(new
        {
            maxFileSizeMb = _storageConfig.MaxFileSizeMb,
            maxFileSizeBytes = _storageConfig.MaxFileSizeBytes,
            allowedFileTypes = _storageConfig.AllowedFileTypes,
            reportsContainerName = _storageConfig.ReportsContainerName,
        });
    }

    [HttpPost("validate")]
    public IActionResult ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "No file provided", isValid = false });
        }

        var fileExtension = Path.GetExtension(file.FileName);
        var isTypeAllowed = _storageConfig.IsFileTypeAllowed(fileExtension);
        var isSizeAllowed = file.Length <= _storageConfig.MaxFileSizeBytes;

        var validationResult = new
        {
            fileName = file.FileName,
            fileSize = file.Length,
            fileExtension = fileExtension,
            isTypeAllowed = isTypeAllowed,
            isSizeAllowed = isSizeAllowed,
            isValid = isTypeAllowed && isSizeAllowed,
            maxAllowedSize = _storageConfig.MaxFileSizeBytes,
            allowedTypes = _storageConfig.AllowedFileTypes
        };

        if (validationResult.isValid)
        {
            return Ok(validationResult);
        }
        else
        {
            return BadRequest(validationResult);
        }
    }

    private static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
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
