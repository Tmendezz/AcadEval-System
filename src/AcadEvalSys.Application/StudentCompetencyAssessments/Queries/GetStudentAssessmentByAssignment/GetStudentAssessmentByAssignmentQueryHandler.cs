using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentAssessmentByAssignment;

public class GetStudentAssessmentByAssignmentQueryHandler(
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    IMapper mapper,
    ILogger<GetStudentAssessmentByAssignmentQueryHandler> logger)
    : IRequestHandler<GetStudentAssessmentByAssignmentQuery, StudentCompetencyEvaluationDto?>
{
    public async Task<StudentCompetencyEvaluationDto?> Handle(GetStudentAssessmentByAssignmentQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving assessment for student {StudentId} in assignment {AssignmentId}", 
            request.StudentId, request.AssignmentId);

        var assessment = await studentCompetencyAssessmentRepository
            .GetByStudentAndAssignmentAsync(request.StudentId, request.AssignmentId);

        if (assessment == null)
        {
            logger.LogInformation("No assessment found for student {StudentId} in assignment {AssignmentId}", 
                request.StudentId, request.AssignmentId);
            return null;
        }

        logger.LogInformation("Assessment found for student {StudentId} in assignment {AssignmentId} with status {Status}", 
            request.StudentId, request.AssignmentId, assessment.Status);

        return mapper.Map<StudentCompetencyEvaluationDto>(assessment);
    }
}
