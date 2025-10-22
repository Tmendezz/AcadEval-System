namespace AcadEvalSys.Application.Evaluations.Dtos;

public class CareerYearAssignmentDetailDto
{
    public Guid AssignmentId { get; set; }
    public string CompetencyName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int TotalStudentsCount { get; set; }
    public int EvaluatedStudentsCount { get; set; }
    public decimal ProgressPercentage { get; set; }
}