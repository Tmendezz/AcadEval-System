using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommandHandler(
        IAcademicSurveyRepository surveyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IUserContext userContext,
        ILogger<CreateAcademicSurveyCommandHandler> logger)
    : IRequestHandler<CreateAcademicSurveyCommand, Guid>
    {
        public async Task<Guid> Handle(CreateAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Iniciando creación de encuesta académica: {Title}", request.Title);

            var user = userContext.GetCurrentUser();
            
            if (user == null)
            {
                logger.LogError("User context is null despite controller authorization");
                throw new InvalidOperationException("User context not found");
            }

            // Mapear el command a la entidad
            var survey = mapper.Map<AcademicSurvey>(request);
            survey.CreatedByUserId = user.Id ?? string.Empty;
       
            // Mapear las preguntas
            survey.Questions = request.Questions.Select(q =>
            {
                var question = mapper.Map<SurveyQuestion>(q);
                question.Options = q.Options.Select(o => mapper.Map<SurveyQuestionOption>(o)).ToList();
                return question;
            }).ToList();
            
            // Crear la encuesta
            var surveyId = await surveyRepository.CreateAsync(survey, cancellationToken);

            logger.LogInformation("Encuesta creada con ID: {SurveyId}", surveyId);

            // Configurar la audiencia usando el repositorio
            var audienceData = request.Audience.Select(a => (a.TechnicalCareerId, a.SelectedYears.AsEnumerable()));
            await surveyRepository.ConfigureSurveyAudienceAsync(surveyId, audienceData, cancellationToken);

            logger.LogInformation("Intentando guardar cambios para encuesta {SurveyId}", surveyId);
            var changesSaved = await unitOfWork.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Cambios guardados: {ChangesSaved} entidades afectadas", changesSaved);

            logger.LogInformation("Encuesta académica creada exitosamente: {SurveyId}", surveyId);
            return surveyId;
        }
    }
}
