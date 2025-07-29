using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetReportDownloadUrl;

public class GetReportDownloadUrlQuery : IRequest<GetReportDownloadUrlDto>
{
    public Guid ReportId { get; set; }
}

public class GetReportDownloadUrlDto
{
    public Guid ReportId { get; set; }
    public string DownloadUrl { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public string FileName { get; set; } = null!;
}
