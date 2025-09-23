using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommandHandler(
        IAcademicSurveyRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<PublishAcademicSurveyCommandHandler> logger)
        : IRequestHandler<PublishAcademicSurveyCommand>
    {
        public async Task Handle(PublishAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Publicando/Reabriendo encuesta {SurveyId}. Reopen={Reopen} CloseAt={CloseAt}",
                request.SurveyId, request.Reopen,  request.CloseAt);

            var survey = await repository.GetByIdAsync(request.SurveyId, cancellationToken);
            if (survey == null)
            {
                throw new NotFoundException(nameof(AcademicSurvey), request.SurveyId.ToString());
            }

            if (request.CloseAt.HasValue)
            {
                survey.CloseAt = request.CloseAt;
            }

            // Transición de estado: Draft/Closed -> Published
            if (survey.Status == SurveyStatus.Draft || (request.Reopen && survey.Status == SurveyStatus.Closed))
            {
                survey.Status = SurveyStatus.Published;
            }

            await repository.UpdateAsync(survey, cancellationToken);
            var changesSaved = await unitOfWork.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Encuesta {SurveyId} publicada/reabierta. Cambios guardados: {Changes}", request.SurveyId, changesSaved);
        }
    }
}


