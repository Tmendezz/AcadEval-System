using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Application.Users.Commands.ChangePassword;

public class ChangePasswordCommandHandler(
    UserManager<User> userManager,
    ILogger<ChangePasswordCommandHandler> logger
    ) : IRequestHandler<ChangePasswordCommand, bool>
{
    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Changing password for user {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("User {UserId} not found", request.UserId);
            return false;
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            logger.LogError("Failed to change password for user {UserId}. Errors: {Errors}", 
                request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
            return false;
        }

        logger.LogInformation("Password changed successfully for user {UserId}", request.UserId);
        return true;
    }
}
