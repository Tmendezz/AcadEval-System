using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;

public class UpdateAcademicSurveyCommandHandler(
    IAcademicSurveyRepository repository,
    IUnitOfWork unitOfWork,
    IUserContext userContext,
    ILogger<UpdateAcademicSurveyCommandHandler> logger)
    : IRequestHandler<UpdateAcademicSurveyCommand>
{
    public async Task Handle(UpdateAcademicSurveyCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Iniciando actualización de encuesta académica: {Id}", request.Id);
        
        var existing = await repository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(AcademicSurvey), request.Id.ToString());
            
        var user = userContext.GetCurrentUser();
        
        if (user == null || string.IsNullOrEmpty(user.Id))
        {
            throw new InvalidOperationException("User context not found");
        }
        
        existing.Title = request.Title?.Trim() ?? existing.Title;
        existing.Description = request.Description?.Trim() ?? existing.Description;
        existing.PublishAt = request.PublishAt;
        existing.CloseAt = request.CloseAt;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.UpdatedByUserId = user.Id;
        
        // Las encuestas se mantienen como Published si tienen PublishAt (a menos que estén cerradas)
        // Los usuarios solo las verán cuando PublishAt <= DateTime.UtcNow
        if (existing.Status != SurveyStatus.Closed)
        {
            existing.Status = existing.PublishAt.HasValue
                ? SurveyStatus.Published
                : SurveyStatus.Draft;
        }
        
        // Actualizar la información básica de la encuesta
        await repository.UpdateAsync(existing, cancellationToken);

        // Actualizar las preguntas si se proporcionaron
        if (request.Questions != null)
        {
            logger.LogInformation("Actualizando preguntas para encuesta {Id}", request.Id);
            
            // Convertir DTOs a entidades del dominio
            var questionEntities = request.Questions.Select((dto, index) => new SurveyQuestion
            {
                Text = dto.Text.Trim(),
                Type = dto.Type,
                Order = dto.Order ?? index + 1,
                IsRequired = dto.IsRequired,
                AllowComment = dto.AllowComment,
                Options = dto.Options?.Select(optionDto => new SurveyQuestionOption
                {
                    Text = optionDto.Text.Trim(),
                    Value = optionDto.Value,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }).ToList() ?? new List<SurveyQuestionOption>()
            });
            
            await repository.ReplaceSurveyQuestionsAsync(request.Id, questionEntities, cancellationToken);
        }

        // Actualizar la audiencia si se proporcionó
        if (request.Audience != null)
        {
            logger.LogInformation("Actualizando audiencia para encuesta {Id}", request.Id);
            var audienceData = request.Audience.Select(a => (a.TechnicalCareerId, a.SelectedYears.AsEnumerable()));
            await repository.ReplaceSurveyAudienceAsync(request.Id, audienceData, cancellationToken);
        }

        logger.LogInformation("Intentando guardar cambios para encuesta {Id}", request.Id);
        var changesSaved = await unitOfWork.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Cambios guardados: {ChangesSaved} entidades afectadas", changesSaved);

        logger.LogInformation("Encuesta académica actualizada exitosamente: {Id}", request.Id);
    }
}
