using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Commands.RemoveProfessor;

public class RemoveProfessorCommandHandler(
    ILogger<RemoveProfessorCommandHandler> logger,
    UserManager<User> userManager,
    IProfessorRepository professorRepository
    ) : IRequestHandler<RemoveProfessorCommand, bool>
{
    public async Task<bool> Handle(RemoveProfessorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Removing professor with ID: {Id}", request.Id);

        var user = await userManager.FindByIdAsync(request.Id);
        if (user == null)
        {
            logger.LogWarning("User with ID {Id} not found", request.Id);
            return false;
        }

        var professor = await professorRepository.GetByIdAsync(request.Id);
        if (professor == null)
        {
            logger.LogWarning("Professor with user ID {Id} not found", request.Id);
            return false;
        }

        // Delete professor entity first
        await professorRepository.DeleteAsync(request.Id);
        
        // Delete user
        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            logger.LogError("Failed to delete user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            throw new InvalidOperationException($"Failed to delete user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        logger.LogInformation("Professor with ID: {Id} removed successfully", request.Id);
        return true;
    }
}
