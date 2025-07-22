using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;

public class ProfessorAssignmentWithStudentsDto
{
    public Guid AssignmentId { get; set; }
    public string CompetencyName { get; set; } = string.Empty;
    public string CompetencyDescription { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public ProfessorAssignmentStatus Status { get; set; }
    public int TotalStudentsCount { get; set; }
    public int EvaluatedStudentsCount { get; set; }
    public decimal ProgressPercentage { get; set; }
    public IEnumerable<StudentCompetencyEvaluationDto> StudentEvaluations { get; set; } = new List<StudentCompetencyEvaluationDto>();
}
