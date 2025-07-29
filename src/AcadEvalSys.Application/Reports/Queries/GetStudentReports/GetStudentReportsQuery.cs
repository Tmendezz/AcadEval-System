using MediatR;

namespace AcadEvalSys.Application.Reports.Queries.GetStudentReports;

public class GetStudentReportsQuery : IRequest<IEnumerable<StudentReportDto>>
{
    public string StudentId { get; set; } = null!;
}

public class StudentReportDto
{
    public Guid Id { get; set; }
    public string StudentId { get; set; } = null!;
    public Guid EvaluationInstanceId { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string? GeneratedByUserId { get; set; }
    public bool HasFile { get; set; }
    public long? FileSizeBytes { get; set; }
    public string? ContentType { get; set; }
    public string? Observation { get; set; }
}
