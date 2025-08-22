using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetCareerCoordinator;

public class GetCareerCoordinatorQueryHandler(
    ILogger<GetCareerCoordinatorQueryHandler> logger,
    ICoordinatorRepository coordinatorRepository
) : IRequestHandler<GetCareerCoordinatorQuery, GetCareerCoordinatorDto?>
{
    public async Task<GetCareerCoordinatorDto?> Handle(GetCareerCoordinatorQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting coordinator for career {TechnicalCareerId}", request.TechnicalCareerId);

        var coordinator = await coordinatorRepository.GetByCareerIdAsync(request.TechnicalCareerId);
        if (coordinator == null)
        {
            logger.LogInformation("No coordinator found for career {TechnicalCareerId}", request.TechnicalCareerId);
            return null;
        }
        
        var user = coordinator.User;
        if (user == null)
        {
            logger.LogWarning("Coordinator user not found for career {TechnicalCareerId}", request.TechnicalCareerId);
            return null;
        }

        return new GetCareerCoordinatorDto
        {
            UserId = user.Id,
            Name = user.Name ?? "Sin nombre",
            Email = user.Email ?? "Sin email"
        };
    }
}



