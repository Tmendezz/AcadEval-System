using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentReceivedEvaluations;

public class GetStudentReceivedEvaluationsQueryHandler(
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    ICompetencyEvaluationInstanceRepository evaluationInstanceRepository,
    IStudentEvaluationReportRepository reportRepository,
    ILogger<GetStudentReceivedEvaluationsQueryHandler> logger)
    : IRequestHandler<GetStudentReceivedEvaluationsQuery, IEnumerable<StudentReceivedEvaluationDto>>
{
    public async Task<IEnumerable<StudentReceivedEvaluationDto>> Handle(GetStudentReceivedEvaluationsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving evaluation instance results for student {StudentId}", request.StudentId);

        // Obtener todas las instancias de evaluación
        var allInstances = await evaluationInstanceRepository.GetAllAsync();
        var studentResults = new List<StudentReceivedEvaluationDto>();

        foreach (var instance in allInstances)
        {
            // Obtener todas las evaluaciones del estudiante en esta instancia
            var instanceAssessments = await studentCompetencyAssessmentRepository
                .GetCompletedByStudentAndInstanceAsync(request.StudentId, instance.Id);

            if (instanceAssessments.Any())
            {
                // Calcular el resultado consolidado de la instancia
                var assessmentsList = instanceAssessments.ToList();
                var totalCompetencies = assessmentsList.Count;
                var completedCompetencies = assessmentsList.Count(a => a.Status == AssessmentStatus.Completed);
                var progressPercentage = totalCompetencies > 0 ? (decimal)completedCompetencies / totalCompetencies * 100 : 0;

                // Obtener el nivel promedio de competencia
                var competencyLevels = instanceAssessments
                    .Where(a => a.CompetencyLevel.HasValue)
                    .Select(a => (int)a.CompetencyLevel!.Value)
                    .ToList();

                var averageLevel = competencyLevels.Any() 
                    ? competencyLevels.Average() 
                    : 0;

                var overallLevel = averageLevel switch
                {
                    >= 3.5 => Domain.Enums.CompetencyLevel.Excelente,
                    >= 2.5 => Domain.Enums.CompetencyLevel.Avanzado,
                    >= 1.5 => Domain.Enums.CompetencyLevel.Intermedio,
                    _ => Domain.Enums.CompetencyLevel.Inicial
                };

                // Buscar el reporte del estudiante para esta instancia
                var report = await reportRepository.GetByStudentAndInstanceAsync(request.StudentId, instance.Id);

                var instanceResult = new StudentReceivedEvaluationDto
                {
                    Id = instance.Id,
                    CompetencyName = "Evaluación General de Competencias",
                    SubjectName = "Todas las Materias",
                    CareerName = "Carrera Completa",
                    Year = "Todos los Años",
                    ProfessorName = "Equipo Docente",
                    Status = Domain.Enums.AssessmentStatus.Completed,
                    CompetencyLevel = overallLevel,
                    AssessmentDate = instanceAssessments.Max(a => a.CompletedAt),
                    DueDate = instance.PeriodTo,
                    Observations = $"Progreso: {completedCompetencies}/{totalCompetencies} competencias evaluadas",
                    EvaluationInstanceTitle = instance.Title ?? "Instancia de Evaluación",
                    EvaluationInstanceDescription = instance.Description ?? $"Período: {instance.PeriodFrom:dd/MM/yyyy} - {instance.PeriodTo:dd/MM/yyyy}",
                    ReportId = report?.Id,
                    Semester = instance.Semester
                };

                studentResults.Add(instanceResult);
            }
        }

        logger.LogInformation("Found {Count} evaluation instance results for student {StudentId}", 
            studentResults.Count, request.StudentId);
        
        return studentResults;
    }
}
