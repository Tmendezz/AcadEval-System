using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;

public class StudentReceivedEvaluationDto
{
    public Guid Id { get; set; }
    public string CompetencyName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string CareerName { get; set; } = string.Empty;
    public string Year { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public AssessmentStatus Status { get; set; }
    public CompetencyLevel? CompetencyLevel { get; set; }
    public DateTime? AssessmentDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Observations { get; set; }
    public string EvaluationInstanceTitle { get; set; } = string.Empty;
    public string EvaluationInstanceDescription { get; set; } = string.Empty;
    public Guid? ReportId { get; set; }
    public Semester Semester { get; set; }
}
