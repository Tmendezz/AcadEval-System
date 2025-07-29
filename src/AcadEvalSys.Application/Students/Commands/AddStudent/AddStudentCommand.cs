using MediatR;

namespace AcadEvalSys.Application.Students.Commands.AddStudent;

public class AddStudentCommand : IRequest<string>
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public Guid CarreraId { get; set; }
}