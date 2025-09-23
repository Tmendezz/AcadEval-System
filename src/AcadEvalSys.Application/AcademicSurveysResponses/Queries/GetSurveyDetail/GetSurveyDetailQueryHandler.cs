using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveyDetail;

public class GetSurveyDetailQueryHandler(
    ILogger<GetSurveyDetailQueryHandler> logger,
    IUserContext userContext,
    IAcademicSurveyRepository surveyRepository,
    IAcademicSurveyResponseRepository responseRepository,
    IMapper mapper
    ) : IRequestHandler<GetSurveyDetailQuery, SurveyForResponseDto?>
{
    public async Task<SurveyForResponseDto?> Handle(GetSurveyDetailQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Obteniendo detalle de encuesta {SurveyId} para el usuario", request.SurveyId);

        var user = userContext.GetCurrentUser();
        
        if (user == null || string.IsNullOrEmpty(user.Id))
        {
            logger.LogWarning("No se pudo obtener el usuario actual");
            throw new UnauthorizedException();
        }

        var role = user.Roles.First();
        
        // Obtener la encuesta primero
        var survey = await surveyRepository.GetByIdAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            logger.LogWarning("No se encontró la encuesta {SurveyId}", request.SurveyId);
            throw new NotFoundException(nameof(AcademicSurvey), request.SurveyId.ToString());
        }

        // Verificar que la encuesta esté publicada
        if (survey.Status != SurveyStatus.Published)
        {
            logger.LogWarning("La encuesta {SurveyId} no está publicada", request.SurveyId);
            throw new ForbidException("La encuesta no está publicada");
        }

        // Verificar que la encuesta esté dentro del período válido
        var now = DateTime.UtcNow;
        if (survey.PublishAt.HasValue && survey.PublishAt > now)
        {
            logger.LogWarning("La encuesta {SurveyId} aún no está disponible", request.SurveyId);
            throw new ForbidException("La encuesta aún no está disponible");
        }

        if (survey.CloseAt.HasValue && survey.CloseAt < now)
        {
            logger.LogWarning("La encuesta {SurveyId} ya expiró", request.SurveyId);
            throw new ForbidException("La encuesta ya expiró");
        }

        // Verificar que el usuario tenga acceso a esta encuesta
        var assignedSurveys = role == UserRoles.Professor 
            ? await responseRepository.GetAssignedSurveysForProfessorAsync(user.Id, null, cancellationToken)
            : await responseRepository.GetAssignedSurveysForStudentAsync(user.Id, null, cancellationToken);

        var assignedSurvey = assignedSurveys.FirstOrDefault(s => s.Survey.Id == request.SurveyId);
        
        if (assignedSurvey == default)
        {
            logger.LogWarning("El usuario {UserId} no tiene acceso a la encuesta {SurveyId}", user.Id, request.SurveyId);
            throw new ForbidException("No tienes acceso a esta encuesta");
        }

        // Si ya respondió la encuesta, no puede verla (solo para responder)
        if (assignedSurvey.HasResponse && !request.ReadOnly)
        {
            logger.LogWarning("El usuario {UserId} ya respondió la encuesta {SurveyId}", user.Id, request.SurveyId);
            throw new ForbidException("Ya respondiste esta encuesta");
        }

        // Mapear usando AutoMapper
        var surveyDto = mapper.Map<SurveyForResponseDto>(survey);
        
        // Si es solo lectura, no incluir las opciones de respuesta para evitar que vean los resultados
        if (request.ReadOnly)
        {
            surveyDto.Questions = surveyDto.Questions.Select(q => new SurveyQuestionForResponseDto
            {
                Id = q.Id,
                Text = q.Text,
                Type = q.Type,
                IsRequired = q.IsRequired,
                AllowComment = q.AllowComment,
                Options = new List<SurveyQuestionOptionForResponseDto>() // Vacío para modo lectura
            }).ToList();
        }

        logger.LogInformation("Se obtuvo exitosamente el detalle de la encuesta {SurveyId}", request.SurveyId);
        
        return surveyDto;
    }
}
