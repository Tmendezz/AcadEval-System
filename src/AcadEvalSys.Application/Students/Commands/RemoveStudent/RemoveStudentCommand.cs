using MediatR;

namespace AcadEvalSys.Application.Students.Commands.RemoveStudent;

public class RemoveStudentCommand(string id) : IRequest<bool>
{
    public string Id { get; set; } = id;
}