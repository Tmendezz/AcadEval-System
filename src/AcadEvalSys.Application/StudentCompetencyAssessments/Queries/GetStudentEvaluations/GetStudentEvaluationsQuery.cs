using MediatR;
using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluations;

public class GetStudentEvaluationsQuery : IRequest<IEnumerable<StudentCompetencyEvaluationDto>>
{
    public string StudentId { get; set; } = string.Empty;
    public Guid? EvaluationInstanceId { get; set; }

    public GetStudentEvaluationsQuery(string studentId, Guid? evaluationInstanceId = null)
    {
        StudentId = studentId;
        EvaluationInstanceId = evaluationInstanceId;
    }
}
