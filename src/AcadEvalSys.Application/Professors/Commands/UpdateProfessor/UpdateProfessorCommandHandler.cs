using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Commands.UpdateProfessor;

public class UpdateProfessorCommandHandler(
    ILogger<UpdateProfessorCommandHandler> logger,
    UserManager<User> userManager,
    IProfessorRepository professorRepository
    ) : IRequestHandler<UpdateProfessorCommand, bool>
{
    public async Task<bool> Handle(UpdateProfessorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating professor with ID: {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("User with ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(User), request.UserId);
        }

        var professor = await professorRepository.GetByIdAsync(request.UserId);
        if (professor == null)
        {
            logger.LogWarning("Professor with user ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(Professor), request.UserId);
        }

        // Update user information
        user.UserName = request.Email;
        user.Email = request.Email;
        user.Name = request.Name;

        var userResult = await userManager.UpdateAsync(user);
        if (!userResult.Succeeded)
        {
            logger.LogError("Failed to update user: {Errors}", string.Join(", ", userResult.Errors.Select(e => e.Description)));
            throw new InvalidOperationException($"Failed to update user: {string.Join(", ", userResult.Errors.Select(e => e.Description))}");
        }

        // Update professor information
        professor.Phone = request.Phone;

        await professorRepository.UpdateAsync(professor);
        
        logger.LogInformation("Professor with ID: {UserId} updated successfully", request.UserId);
        return true;
    }
}
