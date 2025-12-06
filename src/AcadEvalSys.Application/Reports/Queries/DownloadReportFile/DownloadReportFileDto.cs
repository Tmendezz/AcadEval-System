namespace AcadEvalSys.Application.Reports.Queries.DownloadReportFile;

public class DownloadReportFileDto
{
    public required byte[] Content { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
}


