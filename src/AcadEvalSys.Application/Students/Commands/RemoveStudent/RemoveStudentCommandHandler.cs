using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Commands.RemoveStudent;

public class RemoveStudentCommandHandler(
    ILogger<RemoveStudentCommandHandler> logger,
    UserManager<User> userManager,
    IStudentRepository studentRepository
    ) : IRequestHandler<RemoveStudentCommand, bool>
{
    public async Task<bool> Handle(RemoveStudentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Removing student with ID: {Id}", request.Id);

        var user = await userManager.FindByIdAsync(request.Id);
        if (user == null)
        {
            logger.LogWarning("User with ID {Id} not found", request.Id);
            return false;
        }

        var student = await studentRepository.GetByUserIdAsync(request.Id);
        if (student == null)
        {
            logger.LogWarning("Student with user ID {Id} not found", request.Id);
            return false;
        }

        // Delete student entity first
        await studentRepository.DeleteAsync(request.Id);
        
        // Delete user
        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            logger.LogError("Failed to delete user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            throw new InvalidOperationException($"Failed to delete user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        logger.LogInformation("Student with ID: {Id} removed successfully", request.Id);
        return true;
    }
}