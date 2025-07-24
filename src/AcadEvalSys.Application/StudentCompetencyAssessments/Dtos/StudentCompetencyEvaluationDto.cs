using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;

public class StudentCompetencyEvaluationDto
{
    public Guid StudentCompetencyAssessmentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string CompetencyLevelDescription { get; set; } = string.Empty;
    public CompetencyLevel? CompetencyLevel { get; set; }
    public AssessmentStatus Status { get; set; }
}