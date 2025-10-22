using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluationInstances;

public class GetStudentEvaluationInstancesQuery : IRequest<IEnumerable<StudentEvaluationInstanceDto>>
{
    public string StudentId { get; set; } = string.Empty;

    public GetStudentEvaluationInstancesQuery(string studentId)
    {
        StudentId = studentId;
    }
}
