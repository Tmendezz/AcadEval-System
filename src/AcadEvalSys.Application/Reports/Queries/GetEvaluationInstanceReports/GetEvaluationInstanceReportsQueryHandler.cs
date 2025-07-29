using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetEvaluationInstanceReports;

public class GetEvaluationInstanceReportsQueryHandler(IStudentEvaluationReportRepository reportRepository)
    : IRequestHandler<GetEvaluationInstanceReportsQuery, IEnumerable<EvaluationInstanceReportDto>>
{
    public async Task<IEnumerable<EvaluationInstanceReportDto>> Handle(GetEvaluationInstanceReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await reportRepository.GetByInstanceIdAsync(request.EvaluationInstanceId);
        
        return reports.Select(r => new EvaluationInstanceReportDto
        {
            Id = r.Id,
            StudentId = r.StudentId,
            StudentName = r.Student?.User?.Name,
            GeneratedAt = r.GeneratedAt,
            HasFile = !string.IsNullOrEmpty(r.BlobName),
            FileSizeBytes = r.FileSizeBytes,
            Observation = r.Observation
        });
    }
}
