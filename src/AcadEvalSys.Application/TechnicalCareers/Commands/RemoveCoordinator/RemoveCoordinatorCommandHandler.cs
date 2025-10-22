using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.RemoveCoordinator;

public class RemoveCoordinatorCommandHandler(
    ILogger<RemoveCoordinatorCommandHandler> logger,
    ICoordinatorRepository coordinatorRepository
) : IRequestHandler<RemoveCoordinatorCommand>
{
    public async Task Handle(RemoveCoordinatorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Removing coordinator from career {TechnicalCareerId}", request.TechnicalCareerId);

        await coordinatorRepository.RemoveByCareerIdAsync(request.TechnicalCareerId);
        
        logger.LogInformation("Coordinator removed from career {TechnicalCareerId}", request.TechnicalCareerId);
    }
}



