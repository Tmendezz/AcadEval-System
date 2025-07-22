using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Evaluations.Dtos;

public class CompetencyAssignmentDto
{
    public Guid AssignmentId { get; set; }
    public string CompetencyName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public ProfessorAssignmentStatus Status { get; set; }
}