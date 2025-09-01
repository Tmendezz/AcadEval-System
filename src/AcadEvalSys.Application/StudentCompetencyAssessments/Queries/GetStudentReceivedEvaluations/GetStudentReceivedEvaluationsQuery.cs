using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentReceivedEvaluations;

public class GetStudentReceivedEvaluationsQuery : IRequest<IEnumerable<StudentReceivedEvaluationDto>>
{
    public string StudentId { get; }

    public GetStudentReceivedEvaluationsQuery(string studentId)
    {
        StudentId = studentId;
    }
}
