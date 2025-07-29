using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Commands.DeleteInstance;

public class DeleteEvaluationInstanceCommandHandler(
    ILogger<DeleteEvaluationInstanceCommandHandler> logger,
    ICompetencyEvaluationInstanceRepository repository) : IRequestHandler<DeleteEvaluationInstanceCommand>
{
    public async Task Handle(DeleteEvaluationInstanceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting evaluation instance {InstanceId}", request.Id);
        await repository.DeleteAsync(request.Id);
    }
}