using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Enums;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Infrastructure.Services.ReportGeneration;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;

namespace AcadEvalSys.Infrastructure.Services;

/// <summary>
/// Servicio para generar reportes de evaluación por competencias de estudiantes.
/// </summary>
/// <remarks>
/// Reglas de generación de reportes:
/// - Solo se genera reporte si el estudiante tiene competencias efectivamente evaluadas (completadas)
/// - Si un alumno cursa solo algunas asignaturas, el reporte incluirá solo las competencias evaluadas
/// - Si no hay evaluaciones completadas, NO se genera ningún reporte
/// - Las competencias duplicadas en materias de diferentes años se evalúan solo una vez por el profesor del año superior
/// </remarks>
public class StudentReportGenerationService(
    ILogger<StudentReportGenerationService> logger,
    IReportService reportService,
    IStorageService storageService,
    IStudentCompetencyAssessmentsRepository assessmentsRepository,
    IStudentEvaluationReportRepository reportRepository,
    ICompetencyEvaluationInstanceRepository evaluationInstanceRepository)
    : IStudentReportGenerationService
{
    /// <summary>
    /// Genera un reporte de evaluación para un estudiante en una instancia de evaluación específica.
    /// </summary>
    /// <param name="studentId">ID del estudiante</param>
    /// <param name="evaluationInstanceId">ID de la instancia de evaluación</param>
    /// <returns>Task que representa la operación asíncrona</returns>
    /// <remarks>
    /// VALIDACIÓN IMPORTANTE: No se generará reporte si el estudiante no tiene competencias evaluadas.
    /// Esto evita crear reportes vacíos para estudiantes que no fueron evaluados.
    /// </remarks>
    public async Task GenerateStudentReportAsync(string studentId, Guid evaluationInstanceId)
    {
        logger.LogInformation("Generating report for student {StudentId} in instance {InstanceId}", 
            studentId, evaluationInstanceId);

        try
        {
            // 1. Obtener la instancia de evaluación
            var evaluationInstance = await evaluationInstanceRepository.GetByIdAsync(evaluationInstanceId);
            if (evaluationInstance == null)
            {
                logger.LogWarning("Evaluation instance {InstanceId} not found", evaluationInstanceId);
                return;
            }

            // 2. Obtener directamente todos los assessments completados del estudiante
            // VALIDACIÓN CRÍTICA: Solo se generará reporte si hay evaluaciones COMPLETADAS
            var completedAssessments =
                await assessmentsRepository.GetCompletedByStudentAndInstanceAsync(studentId, evaluationInstanceId);

            // Si no hay competencias evaluadas, NO se genera reporte
            // Esto cumple con el requisito: "Si el alumno no posee evaluaciones registradas 
            // en ninguna competencia, no deberá generarse ningún reporte"
            if (!completedAssessments.Any())
            {
                logger.LogWarning(
                    "No completed assessments found for student {StudentId} in instance {InstanceId}. " +
                    "Report generation skipped - student has no evaluated competencies.",
                    studentId, evaluationInstanceId);
                return;
            }
            
            logger.LogInformation(
                "Found {Count} completed assessments for student {StudentId}. Proceeding with report generation.",
                completedAssessments.Count(), studentId);

            // 3. Obtener datos del estudiante del primer assessment
            var studentData = completedAssessments.First().Student;
            if (studentData?.User is null || studentData.TechnicalCareer is null)
            {
                logger.LogWarning("Student data incomplete for student {StudentId} in instance {InstanceId}", 
                    studentId, evaluationInstanceId);
                return;
            }

            // 4. Construir el DTO para el reporte
            var reportData = new StudentSummaryReportData
            {
                StudentName = studentData.User.Name,
                CareerName = studentData.TechnicalCareer.Name,
                GeneratedDate = DateTime.UtcNow,
                Competencies = completedAssessments.Select(assessment => new CompetencyReportDto
                {
                    Name = assessment.ProfessorCompetencyAssignment?.Competency?.Name ?? string.Empty,
                    CompetencyLevel = assessment.CompetencyLevel,
                    Subject = assessment.ProfessorCompetencyAssignment?.Subject?.Name ?? string.Empty,
                    Professor = assessment.ProfessorCompetencyAssignment?.Subject?.Professor?.User?.Name ?? string.Empty,
                    Description = assessment.ProfessorCompetencyAssignment?.Competency?.LevelDescriptions?
                        .FirstOrDefault(ld => ld.Level == assessment.CompetencyLevel)?.Description
                        ?? "Sin calificar"
                }).ToList()
            };

            // 5. Generar el reporte PDF
            using var pdfStream = await reportService.GenerateStudentEvaluationSummaryReportAsync(reportData);

            // 6. Construir la estructura de carpetas según el formato especificado:
            // EvaluacionPorCompetencias/Evaluacion_Competencia_{FechaGeneracion}/{Tecnicatura}/{Año}/reporte-{studentId}.pdf
            // Usar la fecha actual cuando se genera el reporte, no la fecha de fin del período
            var evaluationFolderName = $"Evaluacion_Competencia_{DateTime.UtcNow:dd-MM-yyyy}";
            var careerName = SanitizeFolderName(studentData.TechnicalCareer.Name ?? "Unknown");
            var yearFolder = studentData.CurrentYear.HasValue 
                ? $"Anio_{(int)studentData.CurrentYear.Value}" 
                : "Anio_Unknown";
            var reportFileName = $"reporte-{SanitizeFolderName(studentData.User.Name ?? "Unknown")}-{studentId}.pdf";
            
            var fullPath = $"EvaluacionPorCompetencias/{evaluationFolderName}/{careerName}/{yearFolder}/{reportFileName}";
            
            logger.LogInformation("Creating report at path: {Path}", fullPath);
            var blobName = await storageService.UploadFileAsync(fullPath, pdfStream);

            // 6. Guardar metadatos del reporte en la base de datos
            var evaluationReport = new StudentEvaluationReport
            {
                StudentId = studentId,
                CompetencyEvaluationInstanceId = evaluationInstanceId,
                GeneratedAt = DateTime.UtcNow,
                BlobName = blobName,
                ContainerName = "reports",
                FileSizeBytes = pdfStream.Length,
                ContentType = "application/pdf"
            };

            await reportRepository.CreateAsync(evaluationReport);

            logger.LogInformation("Successfully generated report for student {StudentId}. BlobName: {BlobName}, Size: {Size} bytes", 
                studentId, blobName, pdfStream.Length);

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating report for student {StudentId} in instance {InstanceId}", 
                studentId, evaluationInstanceId);
            throw;
        }
    }

    /// <summary>
    /// Sanitiza el nombre de una carpeta eliminando caracteres especiales
    /// </summary>
    private static string SanitizeFolderName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "Unknown";

        // Reemplazar espacios por guiones bajos
        var sanitized = name.Replace(" ", "_");
        
        // Eliminar caracteres no válidos para nombres de archivos/carpetas
        var invalidChars = new[] { '/', '\\', ':', '*', '?', '"', '<', '>', '|' };
        foreach (var c in invalidChars)
        {
            sanitized = sanitized.Replace(c.ToString(), "");
        }

        return sanitized;
    }
}
