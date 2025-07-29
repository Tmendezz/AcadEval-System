using AcadEvalSys.Application.Professors.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Professors.Queries.GetProfessor;

public class GetProfessorByIdQuery(string id) : IRequest<ProfessorDto>
{
    public string Id { get; set; } = id;
}
