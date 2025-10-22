using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.DownloadReportFile;

public class DownloadReportFileQueryHandler(
    IStudentEvaluationReportRepository reportRepository,
    IStorageService storageService,
    IUserContext userContext
) : IRequestHandler<DownloadReportFileQuery, DownloadReportFileDto>
{
    public async Task<DownloadReportFileDto> Handle(DownloadReportFileQuery request, CancellationToken cancellationToken)
    {
        var report = await reportRepository.GetByIdAsync(request.ReportId);
        if (report is null)
        {
            throw new NotFoundException(nameof(StudentEvaluationReport), request.ReportId.ToString());
        }

        if (string.IsNullOrWhiteSpace(report.BlobName))
        {
            throw new InvalidOperationException("Report file not available");
        }

        var currentUser = userContext.GetCurrentUser();
        if (currentUser is null)
        {
            throw new UnauthorizedAccessException("User must be authenticated");
        }

        var isAdminOrStaff = currentUser.IsInRole(UserRoles.Admin) || currentUser.IsInRole(UserRoles.Coordinator) || currentUser.IsInRole(UserRoles.Professor);
        var isOwner = string.Equals(report.StudentId, currentUser.Id, StringComparison.OrdinalIgnoreCase);

        if (!isAdminOrStaff && !isOwner)
        {
            throw new ForbidException("You are not allowed to access this report");
        }

        var content = await storageService.DownloadFileAsync(report.BlobName, "reports");
        var fileName = $"report_{report.StudentId}_{report.GeneratedAt:yyyyMMdd}.pdf";

        return new DownloadReportFileDto
        {
            Content = content,
            ContentType = "application/pdf",
            FileName = fileName
        };
    }
}


