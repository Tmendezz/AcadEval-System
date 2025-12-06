namespace AcadEvalSys.Application.Professors.Queries.GetProfessorAssignments;

public class ProfessorAssignmentsDto
{
    public bool HasAssignments { get; set; }
    public List<SubjectAssignmentDto> AssignedSubjects { get; set; } = new();
}

public class SubjectAssignmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CareerName { get; set; } = string.Empty;
    public int Year { get; set; }
}


