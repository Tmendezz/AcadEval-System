using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentAssessmentByAssignment;

public class GetStudentAssessmentByAssignmentQuery(Guid assignmentId, string studentId) : IRequest<StudentCompetencyEvaluationDto?>
{
    public Guid AssignmentId { get; set; } = assignmentId;
    public string StudentId { get; set; } = studentId;
}
