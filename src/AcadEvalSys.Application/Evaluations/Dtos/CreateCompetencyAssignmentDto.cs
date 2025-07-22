namespace AcadEvalSys.Application.Evaluations.Dtos;

public record CreateCompetencyAssignmentDto
{
    public Guid CompetencyId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid CompetencyEvaluationInstanceId { get; set; }
}