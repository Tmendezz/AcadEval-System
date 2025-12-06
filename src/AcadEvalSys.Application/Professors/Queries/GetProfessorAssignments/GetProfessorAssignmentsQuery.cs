using MediatR;

namespace AcadEvalSys.Application.Professors.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQuery : IRequest<ProfessorAssignmentsDto>
{
    public string ProfessorId { get; set; } = string.Empty;
}


