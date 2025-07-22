using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetReportDownloadUrl;

public class GetReportDownloadUrlQueryHandler(
    IStudentEvaluationReportRepository reportRepository,
    IStorageService storageService)
    : IRequestHandler<GetReportDownloadUrlQuery, GetReportDownloadUrlDto>
{
    public async Task<GetReportDownloadUrlDto> Handle(GetReportDownloadUrlQuery request, CancellationToken cancellationToken)
    {
        var report = await reportRepository.GetByIdAsync(request.ReportId);
        
        if (report == null)
        {
            throw new NotFoundException(nameof(StudentEvaluationReport), request.ReportId.ToString());
        }

        if (string.IsNullOrEmpty(report.BlobName))
        {
            throw new InvalidOperationException("Report file not available");
        }

        // Generar URL temporal (24 horas)
        var downloadUrl = await storageService.GetReportUrlAsync(report.BlobName);

        return new GetReportDownloadUrlDto
        {
            ReportId = request.ReportId,
            DownloadUrl = downloadUrl,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            FileName = $"report_{report.StudentId}_{report.GeneratedAt:yyyyMMdd}.pdf"
        };
    }
}
