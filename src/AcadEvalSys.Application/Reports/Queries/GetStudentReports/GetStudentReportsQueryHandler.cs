using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetStudentReports;

public class GetStudentReportsQueryHandler : IRequestHandler<GetStudentReportsQuery, IEnumerable<StudentReportDto>>
{
    private readonly IStudentEvaluationReportRepository _reportRepository;

    public GetStudentReportsQueryHandler(IStudentEvaluationReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<IEnumerable<StudentReportDto>> Handle(GetStudentReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await _reportRepository.GetByStudentIdAsync(request.StudentId);
        
        return reports.Select(r => new StudentReportDto
        {
            Id = r.Id,
            StudentId = r.StudentId,
            EvaluationInstanceId = r.CompetencyEvaluationInstanceId,
            GeneratedAt = r.GeneratedAt,
            GeneratedByUserId = r.GeneratedByUserId,
            HasFile = !string.IsNullOrEmpty(r.BlobName),
            FileSizeBytes = r.FileSizeBytes,
            ContentType = r.ContentType,
            Observation = r.Observation
        });
    }
}
