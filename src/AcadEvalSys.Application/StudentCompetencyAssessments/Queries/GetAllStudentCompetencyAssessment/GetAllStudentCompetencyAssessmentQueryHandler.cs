using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetAllStudentCompetencyAssessment;

public class GetAllStudentCompetencyAssessmentQueryHandler(
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    IMapper mapper,
    ILogger<GetAllStudentCompetencyAssessmentQueryHandler> logger)
    : IRequestHandler<GetAllStudentCompetencyAssessmentQuery, CompetencyAssessmentGroupDto>
{
    public async Task<CompetencyAssessmentGroupDto> Handle(GetAllStudentCompetencyAssessmentQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all student competency assessments for assignment ID: {AssignmentId}", request.AssignmentId);

        var assessments = await studentCompetencyAssessmentRepository
            .GetByAssignmentAsync(request.AssignmentId);

        var assessmentsList = assessments.ToList();
        logger.LogInformation("Retrieved {Count} student competency assessments for assignment ID: {AssignmentId}",
            assessmentsList.Count, request.AssignmentId);

        var assessmentsDto = mapper.Map<CompetencyAssessmentGroupDto>(assessmentsList);

        logger.LogInformation("Assignment progress: {EvaluatedCount}/{TotalCount} students evaluated ({ProgressPercentage}%)",
            assessmentsDto.EvaluatedStudentsCount, assessmentsDto.TotalStudentsCount, assessmentsDto.ProgressPercentage);

        return assessmentsDto;
    }
}
