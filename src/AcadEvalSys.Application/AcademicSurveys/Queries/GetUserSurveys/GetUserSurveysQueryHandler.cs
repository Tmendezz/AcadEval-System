using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetUserSurveys;

public class GetUserSurveysQueryHandler(
    IAcademicSurveyRepository surveyRepository,
    IUserContext userContext,
    ILogger<GetUserSurveysQueryHandler> logger)
    : IRequestHandler<GetUserSurveysQuery, IEnumerable<UserSurveyDto>>
{
    public async Task<IEnumerable<UserSurveyDto>> Handle(GetUserSurveysQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser?.Id == null)
        {
            logger.LogWarning("No current user found for GetUserSurveysQuery");
            return [];
        }

        logger.LogInformation("Getting surveys for user: {UserId}, Status filter: {Status}", 
            currentUser.Id, request.Status ?? "all");

        // Convertir userId string a Guid
        if (!Guid.TryParse(currentUser.Id, out var userId))
        {
            logger.LogError("Invalid user ID format: {UserId}", currentUser.Id);
            return [];
        }

        // Obtener encuestas del usuario con información de respuesta
        var userSurveysWithResponse = await surveyRepository.GetUserSurveysWithResponseInfoAsync(userId, cancellationToken);
        
        logger.LogInformation("Found {TotalSurveySubjects} survey-subject relationships for user {UserId}", 
            userSurveysWithResponse.Count(), currentUser.Id);
        
        // Agrupar por encuesta para evitar duplicados
        var surveys = userSurveysWithResponse
            .GroupBy(item => item.Survey.Id)
            .Select(group => 
            {
                var firstItem = group.First(); // Usar el primer SurveySubject como representativo
                var hasAnyResponse = group.Any(item => item.HasResponded); // Si cualquier materia fue respondida
                var latestResponseDate = group
                    .Where(item => item.RespondedAt.HasValue)
                    .Max(item => item.RespondedAt); // Fecha más reciente de respuesta
                
                return new UserSurveyDto
                {
                    Id = firstItem.Survey.Id,
                    Title = firstItem.Survey.Title,
                    Description = firstItem.Survey.Description,
                    Status = (int)firstItem.Survey.Status,
                    PublishedAt = firstItem.Survey.PublishAt ?? DateTime.MinValue,
                    ClosedAt = firstItem.Survey.CloseAt,
                    Responded = hasAnyResponse,
                    RespondedAt = latestResponseDate,
                    QuestionsCount = firstItem.Survey.Questions.Count,
                    SurveySubjectId = firstItem.SurveySubject.Id // Usar el primer SurveySubject
                };
            });

        logger.LogInformation("After grouping: {UniqueSurveys} unique surveys for user {UserId}", 
            surveys.Count(), currentUser.Id);

        // Filtrar por estado si se especifica
        if (!string.IsNullOrEmpty(request.Status))
        {
            var currentTime = DateTime.UtcNow;
            
            switch (request.Status.ToLower())
            {
                case "pending":
                    surveys = surveys.Where(s => 
                        !s.Responded && 
                        s.Status == (int)SurveyStatus.Published &&
                        (!s.ClosedAt.HasValue || s.ClosedAt > currentTime)); // No cerrada aún
                    break;
                case "completed":
                    surveys = surveys.Where(s => s.Responded);
                    break;
                // "all" o cualquier otro valor: no filtrar
            }
        }

        var result = surveys.OrderByDescending(s => s.PublishedAt).ToList();
        
        logger.LogInformation("Found {Count} surveys for user {UserId}", result.Count, currentUser.Id);
        
        return result;
    }
}