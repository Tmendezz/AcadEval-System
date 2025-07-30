using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Hangfire;

namespace AcadEvalSys.Infrastructure.Services;

public class ReportGenerationBackgroundService(
    ILogger<ReportGenerationBackgroundService> logger,
    IStudentReportGenerationService studentReportService,
    ICompetencyEvaluationInstanceRepository instanceRepository)
    : IReportGenerationBackgroundService
{
    public Task EnqueueReportGenerationAsync(Guid evaluationInstanceId)
    {
        logger.LogInformation("Enqueuing report generation for evaluation instance {InstanceId}", evaluationInstanceId);

        // Encolar la tarea con Hangfire en la cola de reportes (nombre de la cola y la tarea a ejecutar)
        BackgroundJob.Enqueue("reports", () => ProcessReportGenerationAsync(evaluationInstanceId));

        return Task.CompletedTask;
    }

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 30, 60, 120 })]
    public async Task ProcessReportGenerationAsync(Guid evaluationInstanceId)
    {
        logger.LogInformation("Starting background report generation for evaluation instance {InstanceId}", evaluationInstanceId);

        try
        {
            var evaluationInstance = await instanceRepository.GetForReportGenerationAsync(evaluationInstanceId);
            if (evaluationInstance == null)
            {
                logger.LogWarning("Evaluation instance {InstanceId} not found", evaluationInstanceId);
                return;
            }

            var studentsWithCompletedAssessments = evaluationInstance.ProfessorCompetencyAssignments?
                .SelectMany(pca => pca.StudentCompetencyAssessments ?? Enumerable.Empty<StudentCompetencyAssessment>())
                .Where(sca => sca.Status == AssessmentStatus.Completed)
                .Select(sca => sca.StudentId)
                .Distinct()
                .ToList() ?? new List<string>();

            if (!studentsWithCompletedAssessments.Any())
            {
                logger.LogWarning("No students with completed assessments found for evaluation instance {InstanceId}", evaluationInstanceId);
                return;
            }

            logger.LogInformation("Processing report generation for {StudentCount} students in instance {InstanceId}",
                studentsWithCompletedAssessments.Count, evaluationInstanceId);

            // 3. Generar reportes para cada estudiante 
            foreach (var studentId in studentsWithCompletedAssessments)
            {
                try
                {
                    await studentReportService.GenerateStudentReportAsync(studentId, evaluationInstance.Id);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to generate report for student {StudentId} in instance {InstanceId}",
                        studentId, evaluationInstanceId);
                    // Continuar con el siguiente estudiante en caso de error
                }
            }

            logger.LogInformation("Completed report generation for evaluation instance {InstanceId}. Processed {StudentCount} students",
                evaluationInstanceId, studentsWithCompletedAssessments.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in background report generation for evaluation instance {InstanceId}", evaluationInstanceId);
            throw;
        }
    }
}
