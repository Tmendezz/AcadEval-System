using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Enums;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Infrastructure.Services.ReportGeneration;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;

namespace AcadEvalSys.Infrastructure.Services;

public class StudentReportGenerationService(
    ILogger<StudentReportGenerationService> logger,
    IReportService reportService,
    IStorageService storageService,
    IStudentCompetencyAssessmentsRepository assessmentsRepository,
    IStudentEvaluationReportRepository reportRepository)
    : IStudentReportGenerationService
{
    public async Task GenerateStudentReportAsync(string studentId, Guid evaluationInstanceId)
    {
        logger.LogInformation("Generating report for student {StudentId} in instance {InstanceId}", 
            studentId, evaluationInstanceId);

        try
        {
            // 1. Obtener directamente todos los assessments completados del estudiante
            var completedAssessments =
                await assessmentsRepository.GetCompletedByStudentAndInstanceAsync(studentId, evaluationInstanceId);

            if (!completedAssessments.Any())
            {
                logger.LogWarning("No completed assessments found for student {StudentId} in instance {InstanceId}", 
                    studentId, evaluationInstanceId);
                return;
            }

            // 2. Obtener datos del estudiante del primer assessment
            var studentData = completedAssessments.First().Student;
            if (studentData?.User is null || studentData.TechnicalCareer is null)
            {
                logger.LogWarning("Student data incomplete for student {StudentId} in instance {InstanceId}", 
                    studentId, evaluationInstanceId);
                return;
            }

            // 3. Construir el DTO para el reporte
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

            // 4. Generar el reporte PDF
            using var pdfStream = await reportService.GenerateStudentEvaluationSummaryReportAsync(reportData);

            // 5. Subir el reporte al storage
            // Si se usa Google DriveStorageService soportamos paths para crear carpetas:
            // EvaluacionesPorCompetencias/Evaluacion_{fecha}/alumno-{id}-reporte.pdf
            var reportFolder = $"EvaluacionesPorCompetencias/Evaluacion_{DateTime.UtcNow:dd-MM-yyyy}";
            var fileName = $"{reportFolder}/alumno-{studentId}-reporte.pdf";
            var blobName = await storageService.UploadFileAsync(fileName, pdfStream);

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
}
