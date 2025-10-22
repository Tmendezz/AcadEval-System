using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.DownloadReportFile;

public record DownloadReportFileQuery(Guid ReportId) : IRequest<DownloadReportFileDto>;


