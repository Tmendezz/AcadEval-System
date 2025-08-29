using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Commands.ResetPassword;

public class ResetUserPasswordCommandHandler(
    ILogger<ResetUserPasswordCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<ResetUserPasswordCommand, string>
{
    public async Task<string> Handle(ResetUserPasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Resetting password for user {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("User with ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(User), request.UserId);
        }

        // Generar token de reset de contraseña
        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        
        // Resetear la contraseña usando el token
        var result = await userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            logger.LogError("Failed to reset password for user {UserId}: {Errors}", request.UserId, errors);
            throw new BadRequestException($"Error al resetear contraseña: {errors}");
        }

        // Forzar cambio de contraseña en el próximo login
        await userManager.UpdateAsync(user);

        logger.LogInformation("Password reset successfully for user {UserId}", request.UserId);
        return user.Id;
    }
}
