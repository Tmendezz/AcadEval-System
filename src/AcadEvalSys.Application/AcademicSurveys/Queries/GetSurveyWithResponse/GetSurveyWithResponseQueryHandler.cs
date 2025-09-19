using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyWithResponse;

public class GetSurveyWithResponseQueryHandler(
    IAcademicSurveyRepository surveyRepository,
    IUserContext userContext,
    ILogger<GetSurveyWithResponseQueryHandler> logger)
    : IRequestHandler<GetSurveyWithResponseQuery, SurveyWithResponseDto?>
{
    public async Task<SurveyWithResponseDto?> Handle(GetSurveyWithResponseQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser?.Id == null)
        {
            logger.LogWarning("No current user found for GetSurveyWithResponseQuery");
            return null;
        }

        logger.LogInformation("Getting survey with response for user: {UserId}, SurveySubjectId: {SurveySubjectId}", 
            currentUser.Id, request.SurveySubjectId);

        // Obtener el survey subject con su información completa
        var surveySubject = await surveyRepository.GetSubjectGraphAsync(request.SurveySubjectId, cancellationToken);
        if (surveySubject?.AcademicSurvey == null)
        {
            logger.LogWarning("Survey subject not found: {SurveySubjectId}", request.SurveySubjectId);
            return null;
        }

        var survey = surveySubject.AcademicSurvey;
        var now = DateTime.UtcNow;

        // Verificar que el usuario tiene acceso a esta encuesta
        // (profesor de la asignatura o estudiante matriculado)
        if (surveySubject.Subject != null)
        {
            var isProfessor = surveySubject.Subject.ProfessorId == currentUser.Id;
            var isEnrolledStudent = surveySubject.Subject.StudentSubjects?.Any(ss => ss.StudentId == currentUser.Id && ss.IsActive) == true;
            
            if (!isProfessor && !isEnrolledStudent)
            {
                logger.LogWarning("User {UserId} does not have access to survey subject {SurveySubjectId}. User is not the professor and is not enrolled in the subject", 
                    currentUser.Id, request.SurveySubjectId);
                return null;
            }

            // Validación adicional de seguridad para estudiantes:
            // Asegurar que el estudiante está realmente matriculado en la asignatura
            if (!isProfessor && isEnrolledStudent)
            {
                var currentYear = DateTime.Now.Year;
                var activeEnrollment = surveySubject.Subject.StudentSubjects?
                    .FirstOrDefault(ss => ss.StudentId == currentUser.Id && ss.IsActive && ss.AcademicYear == currentYear);
                
                if (activeEnrollment == null)
                {
                    logger.LogWarning("User {UserId} enrollment in subject {SubjectId} is not active for current academic year {Year}", 
                        currentUser.Id, surveySubject.Subject.Id, currentYear);
                    return null;
                }
            }
        }

        // Obtener respuesta existente del usuario
        var userResponse = await surveyRepository.GetResponseAsync(request.SurveySubjectId, currentUser.Id, cancellationToken);
        var hasResponded = userResponse != null;

        // Determinar si es solo lectura
        var isReadOnly = request.ReadOnly || 
                        hasResponded || 
                        survey.Status != SurveyStatus.Published ||
                        (survey.CloseAt.HasValue && survey.CloseAt < now);

        var result = new SurveyWithResponseDto
        {
            Id = survey.Id,
            Title = survey.Title,
            Description = survey.Description,
            Status = (int)survey.Status,
            PublishedAt = survey.PublishAt,
            ClosedAt = survey.CloseAt,
            IsReadOnly = isReadOnly,
            HasResponded = hasResponded,
            RespondedAt = userResponse?.SubmittedAt,
            SurveySubjectId = request.SurveySubjectId,
            SubjectName = surveySubject.Subject?.Name ?? string.Empty,
            Questions = survey.Questions
                .OrderBy(q => q.Order)
                .Select(q => new SurveyQuestionWithResponseDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Type = (int)q.Type,
                    IsRequired = q.IsRequired,
                        AllowComment = q.AllowComment,
                    Order = q.Order,
                    Options = q.Options
                        .OrderBy(o => o.Order)
                        .Select(o => new SurveyQuestionOptionDto
                        {
                            Value = o.Value,
                            Text = o.Text,
                            AllowOpenText = o.AllowOpenText,
                            Order = o.Order
                        }).ToList(),
                    Response = GetQuestionResponse(userResponse, q.Id)
                }).ToList()
        };

        logger.LogInformation("Retrieved survey {SurveyId} with {QuestionCount} questions for user {UserId}. IsReadOnly: {IsReadOnly}, HasResponded: {HasResponded}", 
            survey.Id, result.Questions.Count, currentUser.Id, isReadOnly, hasResponded);

        return result;
    }

    private static SurveyQuestionResponseDto? GetQuestionResponse(Domain.Entities.AcademicSurveyResponse? userResponse, Guid questionId)
    {
        var questionResponse = userResponse?.QuestionResponses?.FirstOrDefault(r => r.SurveyQuestionId == questionId);
        if (questionResponse == null) return null;

        return new SurveyQuestionResponseDto
        {
            SelectedValue = questionResponse.SelectedValue,
            Text = questionResponse.Text
        };
    }
}


