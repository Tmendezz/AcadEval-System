using MediatR;

namespace AcadEvalSys.Application.Professors.Commands.RemoveProfessor;

public class RemoveProfessorCommand(string id) : IRequest<RemoveProfessorResult>
{
    public string Id { get; set; } = id;
}

public class RemoveProfessorResult
{
    public bool Success { get; set; }
    public bool HasAssignments { get; set; }
    public List<SubjectAssignmentDto> AssignedSubjects { get; set; } = new();
    public string? Message { get; set; }
}

public class SubjectAssignmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CareerName { get; set; } = string.Empty;
    public int Year { get; set; }
}
