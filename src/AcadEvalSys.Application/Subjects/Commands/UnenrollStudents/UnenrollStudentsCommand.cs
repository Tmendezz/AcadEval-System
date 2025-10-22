using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.UnenrollStudents;

public class UnenrollStudentsCommand : IRequest<UnenrollStudentsResult>
{
    public Guid SubjectId { get; set; }
    public List<string> StudentIds { get; set; } = new();
}

public class UnenrollStudentsResult
{
    public int StudentsUnenrolled { get; set; }
    public int StudentsNotFound { get; set; }
    public List<string> Errors { get; set; } = new();
}
