using MediatR;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Commands.DeleteInstance;

public class DeleteEvaluationInstanceCommandHandler(
    ILogger<DeleteEvaluationInstanceCommandHandler> logger,
    ICompetencyEvaluationInstanceRepository evaluationInstanceRepository) : IRequestHandler<DeleteEvaluationInstanceCommand>
{
    public async Task Handle(DeleteEvaluationInstanceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting CompetencyEvaluationInstance with ID: {Id}", request.Id);

        // Verificar que la evaluación existe
        var instance = await evaluationInstanceRepository.GetByIdAsync(request.Id);
        if (instance == null)
        {
            logger.LogWarning("CompetencyEvaluationInstance with ID {Id} not found", request.Id);
            throw new NotFoundException(nameof(instance), request.Id.ToString());
        }

        await evaluationInstanceRepository.DeleteAsync(request.Id);

        logger.LogInformation("CompetencyEvaluationInstance with ID {Id} deleted successfully", request.Id);
    }
}