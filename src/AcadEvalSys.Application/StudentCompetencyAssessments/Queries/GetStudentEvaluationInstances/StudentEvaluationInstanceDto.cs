using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluationInstances;

public class StudentEvaluationInstanceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PeriodFrom { get; set; }
    public DateTime PeriodTo { get; set; }
    public EvaluationStatus Status { get; set; }
    public Semester Semester { get; set; }
    public int TotalCompetencies { get; set; }
    public int CompletedCompetencies { get; set; }
    public decimal ProgressPercentage { get; set; }
    public bool HasReport { get; set; }
    public Guid? ReportId { get; set; }
}
