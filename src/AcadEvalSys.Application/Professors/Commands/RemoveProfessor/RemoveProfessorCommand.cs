using MediatR;

namespace AcadEvalSys.Application.Professors.Commands.RemoveProfessor;

public class RemoveProfessorCommand(string id) : IRequest<bool>
{
    public string Id { get; set; } = id;
}
