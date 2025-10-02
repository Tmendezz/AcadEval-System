using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.DeleteAcademicSurvey;

public class DeleteAcademicSurveyCommandHandler(
    ILogger<DeleteAcademicSurveyCommandHandler> logger,
    IAcademicSurveyRepository repository
) : IRequestHandler<DeleteAcademicSurveyCommand>
{
    public async Task Handle(DeleteAcademicSurveyCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Eliminando encuesta {SurveyId}", request.Id);

        // El repositorio se encarga de validar existencia y respuestas
        await repository.DeleteAsync(request.Id, cancellationToken);

        logger.LogInformation("Encuesta {SurveyId} eliminada correctamente", request.Id);
    }
}