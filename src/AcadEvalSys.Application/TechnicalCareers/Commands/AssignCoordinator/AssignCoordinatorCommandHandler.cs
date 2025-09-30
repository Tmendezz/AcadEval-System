using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.AssignCoordinator;

public class AssignCoordinatorCommandHandler(
    ILogger<AssignCoordinatorCommandHandler> logger,
    ITechnicalCareerRepository careerRepository,
    UserManager<User> userManager,
    ICoordinatorRepository coordinatorRepository
) : IRequestHandler<AssignCoordinatorCommand>
{
    public async Task Handle(AssignCoordinatorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Assigning coordinator {UserId} to career {CareerId}", request.UserId, request.TechnicalCareerId);

        var career = await careerRepository.GetCareerByIdAsync(request.TechnicalCareerId)
                     ?? throw new NotFoundException(nameof(TechnicalCareer), request.TechnicalCareerId.ToString());

        var user = await userManager.FindByIdAsync(request.UserId)
                   ?? throw new NotFoundException(nameof(User), request.UserId);

        // Validación removida: cualquier usuario puede ser coordinador

        // Asegurar rol Coordinator
        if (!await userManager.IsInRoleAsync(user, UserRoles.Coordinator))
        {
            await userManager.AddToRoleAsync(user, UserRoles.Coordinator);
        }

    // Enforce 1 coordinator per career: remove existing for this career, then add new
    await coordinatorRepository.RemoveByCareerIdAsync(request.TechnicalCareerId);
    await coordinatorRepository.AddAsync(new Coordinator { UserId = user.Id, TechnicalCareerId = request.TechnicalCareerId });

        // Actualizar el campo UpdatedAt para auditoría
        career.UpdatedAt = DateTime.UtcNow;
        await careerRepository.Update(career);
    }
}


