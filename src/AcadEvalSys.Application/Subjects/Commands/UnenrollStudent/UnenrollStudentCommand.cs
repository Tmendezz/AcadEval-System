using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.UnenrollStudent;

public class UnenrollStudentCommand : IRequest<bool>
{
    public Guid SubjectId { get; set; }
    public string StudentId { get; set; } = string.Empty;
}
