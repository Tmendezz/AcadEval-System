using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQuery : IRequest<IEnumerable<ProfessorAssignmentWithStudentsDto>>
{
    public string ProfessorId { get; set; } = string.Empty;
    public Guid? EvaluationInstanceId { get; set; }

    public GetProfessorAssignmentsQuery(string professorId, Guid? evaluationInstanceId = null)
    {
        ProfessorId = professorId;
        EvaluationInstanceId = evaluationInstanceId;
    }
}
