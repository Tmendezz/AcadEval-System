using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;

namespace AcadEvalSys.Application.Users.Commands.GenerateTemporaryPassword;

public class GenerateTemporaryPasswordCommandHandler(
    ILogger<GenerateTemporaryPasswordCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<GenerateTemporaryPasswordCommand, GenerateTemporaryPasswordResult>
{
    public async Task<GenerateTemporaryPasswordResult> Handle(GenerateTemporaryPasswordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Generating temporary password for user {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("User with ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(User), request.UserId);
        }

        // Generar contraseña temporal segura
        var temporaryPassword = GenerateSecureTemporaryPassword();
        
        // Generar token de reset de contraseña
        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        
        // Resetear la contraseña usando el token
        var result = await userManager.ResetPasswordAsync(user, resetToken, temporaryPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            logger.LogError("Failed to set temporary password for user {UserId}: {Errors}", request.UserId, errors);
            throw new BadRequestException($"Error al establecer contraseña temporal: {errors}");
        }

        // Marcar que la contraseña debe ser cambiada
        await userManager.UpdateAsync(user);

        logger.LogInformation("Temporary password generated successfully for user {UserId}", request.UserId);
        
        return new GenerateTemporaryPasswordResult
        {
            UserId = user.Id,
            Email = user.Email,
            Name = user.Name,
            TemporaryPassword = temporaryPassword
        };
    }

    private static string GenerateSecureTemporaryPassword()
    {
        // Generar contraseña temporal con formato: Temp123! + 4 caracteres aleatorios
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new byte[4];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(random);
        
        var randomPart = new string(random.Select(b => chars[b % chars.Length]).ToArray());
        return $"Temp123!{randomPart}";
    }
}
