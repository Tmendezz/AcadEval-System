using AcadEvalSys.Application.Dashboard.Dtos;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Dashboard.Queries.GetDashboardStats;

public class GetDashboardStatsQueryHandler(
    ILogger<GetDashboardStatsQueryHandler> logger,
    IStudentRepository studentRepository,
    IProfessorRepository professorRepository,
    ITechnicalCareerRepository careerRepository,
    ICompetencyEvaluationInstanceRepository evaluationRepository,
    IAcademicSurveyRepository surveyRepository) : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Obteniendo estadísticas del dashboard");

        // Contar estudiantes (solo necesitamos el totalCount)
        var (_, studentsCount) = await studentRepository.GetAllAsync(1, 1, null, null, null);
        
        // Contar profesores (solo necesitamos el totalCount)
        var (_, professorsCount) = await professorRepository.GetAllAsync(1, 1, null, null);
        
        // Contar carreras
        var careers = await careerRepository.GetAllCareersAsync();
        var careersCount = careers.Count();
        
        // Obtener todas las evaluaciones
        var allEvaluations = await evaluationRepository.GetAllAsync();
        var evaluationsList = allEvaluations.ToList();
        
        // Contar evaluaciones en progreso (Pending o que no estén Completed)
        var evaluationsInProgressCount = evaluationsList
            .Count(e => e.Status != EvaluationStatus.Completed && e.Status != EvaluationStatus.Cancelled);
        
        // Contar total de evaluaciones
        var totalEvaluations = evaluationsList.Count;
        
        // Contar evaluaciones completadas
        var completedEvaluations = evaluationsList
            .Count(e => e.Status == EvaluationStatus.Completed);
        
        // Obtener encuestas en progreso (Published)
        var surveysInProgress = await surveyRepository.GetAllAsync(SurveyStatus.Published, null, cancellationToken);
        var surveysInProgressCount = surveysInProgress.Count;

        // Actividad reciente (por ahora vacía, se puede implementar después)
        var recentActivity = new List<ActivityItemDto>();

        var result = new DashboardStatsDto
        {
            StudentsCount = studentsCount,
            ProfessorsCount = professorsCount,
            CareersCount = careersCount,
            EvaluationsInProgressCount = evaluationsInProgressCount,
            TotalEvaluations = totalEvaluations,
            CompletedEvaluations = completedEvaluations,
            SurveysInProgressCount = surveysInProgressCount,
            RecentActivity = recentActivity
        };

        logger.LogInformation(
            "Estadísticas obtenidas: {StudentsCount} estudiantes, {ProfessorsCount} profesores, {CareersCount} carreras, " +
            "{EvaluationsInProgressCount} evaluaciones en progreso, {TotalEvaluations} total evaluaciones, " +
            "{CompletedEvaluations} completadas, {SurveysInProgressCount} encuestas en progreso",
            studentsCount, professorsCount, careersCount, evaluationsInProgressCount, 
            totalEvaluations, completedEvaluations, surveysInProgressCount);

        return result;
    }
}

