using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Commands.EvaluateStudentCompetency;

public class EvaluateStudentCompetencyCommand : IRequest
{
    public string StudentId { get; set; } = string.Empty;
    public Guid ProfessorCompetencyAssignmentId { get; set; }
    public CompetencyLevel CompetencyLevel { get; set; }
}
