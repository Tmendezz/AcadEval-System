using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using AcadEvalSys.Infrastructure.Services.ReportGeneration;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;

namespace AcadEvalSys.Infrastructure.Services;

public class EvaluationCompletionService(
    ILogger<EvaluationCompletionService> logger,
    IStudentRepository studentRepo,
    ICompetencyEvaluationInstanceRepository instanceRepo,
    IReportService reportService,
    IStorageService storageService,
    IStudentEvaluationReportRepository reportRepository)
    : IEvaluationCompletionService
{
    public async Task ProcessCompletedEvaluationAsync(string studentId, Guid evaluationInstanceId)
    {
        logger.LogInformation("Processing completed evaluation for student {StudentId} in instance {InstanceId}", studentId, evaluationInstanceId);

        try
        {
            // 1. Obtener los datos necesarios con métodos de carga específicos para el reporte
            var student = await studentRepo.GetForReportGenerationAsync(studentId);
            var instance = await instanceRepo.GetForReportGenerationAsync(evaluationInstanceId); // ✅ Usar método específico

            if (student is null || instance is null)
            {
                logger.LogWarning("Student or EvaluationInstance not found. StudentId: {StudentId}, InstanceId: {InstanceId}", studentId, evaluationInstanceId);
                return;
            }

            var assessments = instance.ProfessorCompetencyAssignments
                .SelectMany(pca => pca.StudentCompetencyAssessments)
                .Where(sca => sca.StudentId == studentId && sca.Status == Domain.Enums.AssessmentStatus.Completed)
                .ToList();

            if (!assessments.Any())
            {
                logger.LogWarning("No completed assessments found for student {StudentId} in instance {InstanceId}", studentId, evaluationInstanceId);
                return;
            }

            // 2. Construir el DTO para el reporte - SIMPLIFICADO con navegación
            var reportData = new StudentSummaryReportData
            {
                StudentName = student.User.Name,
                CareerName = student.TechnicalCareer.Name,
                GeneratedDate = DateTime.UtcNow,
                Competencies = assessments.Select(a => new CompetencyReportDto
                {
                    Name = a.ProfessorCompetencyAssignment.Competency.Name,
                    CompetencyLevel = a.CompetencyLevel,
                    Subject = a.ProfessorCompetencyAssignment.Subject.Name,
                    Professor = a.ProfessorCompetencyAssignment.Subject.Professor.User.Name,
                    // ✅ MUCHO MÁS SIMPLE: Navegación directa
                    Description = a.ProfessorCompetencyAssignment.Competency.LevelDescriptions
                        .First(ld => ld.Level == a.CompetencyLevel).Description
                }).ToList()
            };

            // 3. Generar el reporte
            // Hacemos un cast para acceder al método específico de la implementación
            if (reportService is not PdfReportService pdfReportService)
            {
                logger.LogError("The configured IReportService is not a PdfReportService, cannot generate summary report.");
                return;
            }

            using var pdfStream = await pdfReportService.GenerateStudentEvaluationSummaryReportAsync(reportData);

            // 4. Subir el reporte al storage
            var fileName = $"student-summary_{studentId}_{evaluationInstanceId}_{DateTime.UtcNow:yyyyMMdd}.pdf";
            var blobName = await storageService.UploadFileAsync(fileName, pdfStream);

            // 5. Guardar la información del reporte en la base de datos - METADATOS COMPLETOS
            var evaluationReport = new StudentEvaluationReport
            {
                StudentId = studentId,
                CompetencyEvaluationInstanceId = evaluationInstanceId,
                GeneratedAt = DateTime.UtcNow,
                BlobName = blobName,
                ContainerName = "reports", // O usar _storageConfiguration.ReportsContainerName
                FileSizeBytes = pdfStream.Length, // ← NUEVO: Tamaño del archivo
                ContentType = "application/pdf", // ← NUEVO: Tipo de contenido
                // GeneratedByUserId se puede agregar si tienes contexto del usuario actual
            };

            await reportRepository.CreateAsync(evaluationReport);

            logger.LogInformation("Successfully generated, uploaded and saved report for student {StudentId}. BlobName: {BlobName}, Size: {Size} bytes, ReportId: {ReportId}", 
                studentId, blobName, pdfStream.Length, evaluationReport.Id);

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing completed evaluation for student {StudentId}", studentId);
            throw;
        }
    }
}
