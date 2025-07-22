using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Hangfire;

namespace AcadEvalSys.Infrastructure.Services;

public class ReportGenerationBackgroundService(
    ILogger<ReportGenerationBackgroundService> logger,
    IEvaluationCompletionService evaluationCompletionService,
    ICompetencyEvaluationInstanceRepository instanceRepository)
    : IReportGenerationBackgroundService
{
    public Task EnqueueReportGenerationAsync(Guid evaluationInstanceId)
    {
        logger.LogInformation("Enqueuing report generation for evaluation instance {InstanceId}", evaluationInstanceId);
        
        // Encolar la tarea con Hangfire en la cola de reportes
        BackgroundJob.Enqueue("reports", () => ProcessReportGenerationAsync(evaluationInstanceId));
        
        return Task.CompletedTask;
    }

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 30, 60, 120 })]
    public async Task ProcessReportGenerationAsync(Guid evaluationInstanceId)
    {
        logger.LogInformation("Starting background report generation for evaluation instance {InstanceId}", evaluationInstanceId);

        try
        {
            // Obtener la instancia con todos los datos necesarios
            var instance = await instanceRepository.GetByIdAsync(evaluationInstanceId);
            if (instance == null)
            {
                logger.LogWarning("Evaluation instance {InstanceId} not found", evaluationInstanceId);
                return;
            }

            // Obtener todos los estudiantes únicos
            var studentIds = instance.ProfessorCompetencyAssignments?
                .SelectMany(pca => pca.StudentCompetencyAssessments)
                .Select(sca => sca.StudentId)
                .Distinct()
                .ToList() ?? new List<string>();

            if (!studentIds.Any())
            {
                logger.LogWarning("No students found for evaluation instance {InstanceId}", evaluationInstanceId);
                return;
            }

            logger.LogInformation("Processing report generation for {StudentCount} students in instance {InstanceId}", 
                studentIds.Count, evaluationInstanceId);

            var successCount = 0;
            var failureCount = 0;

            foreach (var studentId in studentIds)
            {
                try
                {
                    await evaluationCompletionService.ProcessCompletedEvaluationAsync(studentId, evaluationInstanceId);
                    successCount++;
                    
                    logger.LogDebug("Report generated successfully for student {StudentId} in instance {InstanceId}", 
                        studentId, evaluationInstanceId);
                }
                catch (Exception studentEx)
                {
                    failureCount++;
                    logger.LogError(studentEx, "Failed to generate report for student {StudentId} in instance {InstanceId}", 
                        studentId, evaluationInstanceId);
                    // Continuar con el siguiente estudiante
                }
            }

            logger.LogInformation("Report generation completed for evaluation instance {InstanceId}. Success: {SuccessCount}, Failures: {FailureCount}", 
                evaluationInstanceId, successCount, failureCount);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Critical error during background report generation for evaluation instance {InstanceId}", evaluationInstanceId);
            throw; // Re-throw para que Hangfire maneje el retry
        }
    }
}
