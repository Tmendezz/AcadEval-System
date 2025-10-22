namespace AcadEvalSys.Application.Evaluations.Queries.GetAssignmentStudents;

public class AssignmentStudentDto
{
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty; // "Evaluated" o "Pending"
    public DateTime? EvaluatedAt { get; set; }
    public string? CompetencyLevel { get; set; }
}