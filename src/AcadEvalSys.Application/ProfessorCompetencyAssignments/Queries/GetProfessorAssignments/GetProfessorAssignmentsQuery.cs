using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQuery(Guid? evaluationInstanceId = null) : IRequest<IEnumerable<ProfessorAssignmentWithStudentsDto>>
{
    public Guid? EvaluationInstanceId { get; set; } = evaluationInstanceId;
}
