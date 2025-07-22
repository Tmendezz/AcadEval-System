using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetEvaluationInstanceReports;

public class GetEvaluationInstanceReportsQuery : IRequest<IEnumerable<EvaluationInstanceReportDto>>
{
    public Guid EvaluationInstanceId { get; set; }
}

public class EvaluationInstanceReportDto
{
    public Guid Id { get; set; }
    public string StudentId { get; set; } = null!;
    public string? StudentName { get; set; }
    public DateTime GeneratedAt { get; set; }
    public bool HasFile { get; set; }
    public long? FileSizeBytes { get; set; }
    public string? Observation { get; set; }
}
