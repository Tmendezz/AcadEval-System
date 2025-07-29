
using System.Reflection;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration;

public interface IImageService
{
    byte[] LoadImage(string imageName);
}

public class EmbeddedImageService : IImageService
{
    public byte[] LoadImage(string imageName)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = $"AcadEvalSys.Infrastructure.Resources.Images.{imageName}";

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
            throw new FileNotFoundException($"Image not found: {imageName}");

        using var memoryStream = new MemoryStream();
        stream.CopyTo(memoryStream);
        return memoryStream.ToArray();
    }
}