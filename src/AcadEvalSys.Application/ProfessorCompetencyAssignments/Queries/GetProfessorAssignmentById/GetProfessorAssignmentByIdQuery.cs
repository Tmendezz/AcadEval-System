using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignmentById;

public class GetProfessorAssignmentByIdQuery(Guid assignmentId) : IRequest<ProfessorAssignmentWithStudentsDto?>
{
    public Guid AssignmentId { get; set; } = assignmentId;
}