using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetAllStudentCompetencyAssessment;

public class GetAllStudentCompetencyAssessmentQuery(Guid assignmentId) : IRequest<CompetencyAssessmentGroupDto>
{
    public Guid AssignmentId { get; set; } = assignmentId;
}
