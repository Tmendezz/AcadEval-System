using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Evaluations.Dtos;

public class EvaluationInstanceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PeriodFrom { get; set; }
    public DateTime PeriodTo { get; set; }
    public CompetencyAssignmentByCareerYearDto[] AssignmentsByCareer { get; set; } = [];
    public int TotalProfessorAssignmentsCount { get; set; }
    public int CompletedProfessorAssignmentsCount { get; set; }
    public decimal OverallProgressPercentage { get; set; }
    public EvaluationStatus Status =>
        CompletedProfessorAssignmentsCount == 0 ? EvaluationStatus.Pending :
        CompletedProfessorAssignmentsCount == TotalProfessorAssignmentsCount ? EvaluationStatus.Completed :
        EvaluationStatus.Pending;
    public DateTime CreatedAt { get; set; }
    public string? CreatedByUserId { get; set; }
    public Semester Semester { get; set; }
}
