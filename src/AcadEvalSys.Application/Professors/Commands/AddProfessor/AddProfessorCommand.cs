using MediatR;

namespace AcadEvalSys.Application.Professors.Commands.AddProfessor;

public class AddProfessorCommand : IRequest<string>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
}
