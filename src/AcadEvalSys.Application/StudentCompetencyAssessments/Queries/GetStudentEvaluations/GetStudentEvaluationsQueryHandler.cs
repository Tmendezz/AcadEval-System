using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluations;

public class GetStudentEvaluationsQueryHandler(
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    IMapper mapper,
    ILogger<GetStudentEvaluationsQueryHandler> logger)
    : IRequestHandler<GetStudentEvaluationsQuery, IEnumerable<StudentCompetencyEvaluationDto>>
{
    public async Task<IEnumerable<StudentCompetencyEvaluationDto>> Handle(GetStudentEvaluationsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving evaluations for student {StudentId}", request.StudentId);

        IEnumerable<StudentCompetencyAssessment> assessments;

        if (request.EvaluationInstanceId.HasValue)
        {
            // Obtener evaluaciones de una instancia específica
            assessments = await studentCompetencyAssessmentRepository
                .GetCompletedByStudentAndInstanceAsync(request.StudentId, request.EvaluationInstanceId.Value);
        }
        else
        {
            // Obtener todas las evaluaciones del estudiante
            var assessment = await studentCompetencyAssessmentRepository
                .GetByStudentAndInstanceAsync(request.StudentId, Guid.Empty);
            
            assessments = assessment != null ? new[] { assessment } : Enumerable.Empty<StudentCompetencyAssessment>();
        }

        if (!assessments.Any())
        {
            logger.LogInformation("No evaluations found for student {StudentId}", request.StudentId);
            return Enumerable.Empty<StudentCompetencyEvaluationDto>();
        }

        var evaluations = mapper.Map<IEnumerable<StudentCompetencyEvaluationDto>>(assessments);
        
        logger.LogInformation("Found {Count} evaluations for student {StudentId}", evaluations.Count(), request.StudentId);
        
        return evaluations;
    }
}
