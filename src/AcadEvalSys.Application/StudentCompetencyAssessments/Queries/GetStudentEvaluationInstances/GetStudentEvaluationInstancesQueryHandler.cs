using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluationInstances;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluationInstances;

public class GetStudentEvaluationInstancesQueryHandler(
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    ICompetencyEvaluationInstanceRepository evaluationInstanceRepository,
    IStudentEvaluationReportRepository reportRepository,
    IMapper mapper,
    ILogger<GetStudentEvaluationInstancesQueryHandler> logger)
    : IRequestHandler<GetStudentEvaluationInstancesQuery, IEnumerable<StudentEvaluationInstanceDto>>
{
    public async Task<IEnumerable<StudentEvaluationInstanceDto>> Handle(GetStudentEvaluationInstancesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving evaluation instances for student {StudentId}", request.StudentId);

        try
        {
            // Obtener todas las instancias de evaluación
            var allInstances = await evaluationInstanceRepository.GetAllAsync();
            
            var studentInstances = new List<StudentEvaluationInstanceDto>();

            foreach (var instance in allInstances)
            {
                // Verificar si el estudiante tiene evaluaciones en esta instancia
                var studentAssessments = await studentCompetencyAssessmentRepository
                    .GetCompletedByStudentAndInstanceAsync(request.StudentId, instance.Id);

                if (studentAssessments.Any())
                {
                    // Verificar si existe un reporte para este estudiante en esta instancia
                    var report = await reportRepository.GetByStudentAndInstanceAsync(request.StudentId, instance.Id);

                    var instanceDto = new StudentEvaluationInstanceDto
                    {
                        Id = instance.Id,
                        Title = instance.Title ?? string.Empty,
                        Description = instance.Description ?? string.Empty,
                        PeriodFrom = instance.PeriodFrom,
                        PeriodTo = instance.PeriodTo,
                        Status = instance.Status,
                        Semester = instance.Semester,
                        TotalCompetencies = instance.TotalProfessorAssignmentsCount,
                        CompletedCompetencies = instance.CompletedProfessorAssignmentsCount,
                        ProgressPercentage = instance.OverallProgressPercentage,
                        HasReport = report != null,
                        ReportId = report?.Id
                    };

                    studentInstances.Add(instanceDto);
                }
            }

            logger.LogInformation("Found {Count} evaluation instances for student {StudentId}", 
                studentInstances.Count, request.StudentId);

            return studentInstances;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving evaluation instances for student {StudentId}", request.StudentId);
            throw;
        }
    }
}
