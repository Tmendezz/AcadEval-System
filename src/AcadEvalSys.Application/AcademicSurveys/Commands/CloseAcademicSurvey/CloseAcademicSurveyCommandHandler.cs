using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommandHandler(
        IAcademicSurveyRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<CloseAcademicSurveyCommandHandler> logger)
        : IRequestHandler<CloseAcademicSurveyCommand>
    {
        public async Task Handle(CloseAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Iniciando cierre de encuesta académica: {SurveyId}, Force: {Force}", 
                request.SurveyId, request.Force);

            var survey = await repository.GetByIdAsync(request.SurveyId, cancellationToken);
    
            if (survey == null)
            {
                logger.LogWarning("Intento de cerrar encuesta inexistente: {SurveyId}", request.SurveyId);
                throw new NotFoundException(nameof(AcademicSurvey), request.SurveyId.ToString());
            }
    
            // Solo validar fecha si NO es forzado
            if (!request.Force && survey.CloseAt != null && survey.CloseAt.Value > DateTime.UtcNow)
            {
                logger.LogInformation("La fecha de cierre todavía no ha llegado para la encuesta {SurveyId}", request.SurveyId);
                return;
            }
    
            // Logear si es un cierre forzado
            if (request.Force && survey.CloseAt != null && survey.CloseAt.Value > DateTime.UtcNow)
            {
                logger.LogWarning("Cierre FORZADO de encuesta {SurveyId} antes de fecha programada: {ScheduledCloseAt}",
                    request.SurveyId, survey.CloseAt.Value);
            }

            if (survey.Status == SurveyStatus.Closed)
            {
                logger.LogInformation("Encuesta {SurveyId} ya está cerrada", request.SurveyId);
                return;
            }
    
            await repository.CloseAsync(request.SurveyId, cancellationToken);
            var changesSaved = await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Encuesta {SurveyId} cerrada exitosamente. Cambios guardados: {ChangesSaved}", 
                request.SurveyId, changesSaved);
        }

    }
}
