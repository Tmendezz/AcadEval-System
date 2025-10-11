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
        logger.LogInformation("🔑 [ChangePassword] Iniciando cambio de contraseña para UserId: {UserId}", request.UserId);
        logger.LogInformation("🔑 [ChangePassword] Longitud de nueva contraseña recibida: {Length} caracteres", request.NewPassword?.Length ?? 0);
        logger.LogInformation("🔑 [ChangePassword] Nueva contraseña empieza con: {Prefix}... (primeros 3 chars)", 
            request.NewPassword?.Length >= 3 ? request.NewPassword.Substring(0, 3) : "N/A");
        logger.LogWarning("🔐 [ChangePassword] DEBUGGING - Contraseña completa: '{Password}'", request.NewPassword ?? "NULL");

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            logger.LogError("❌ [ChangePassword] Nueva contraseña es NULL o vacía");
            return false;
        }

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("❌ [ChangePassword] Usuario {UserId} no encontrado", request.UserId);
            return false;
        }

        logger.LogInformation("✅ [ChangePassword] Usuario encontrado: {UserName} ({Email})", user.UserName, user.Email);
        
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        logger.LogInformation("🎫 [ChangePassword] Token de reset generado para usuario {UserId}", request.UserId);
        
        var result = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            logger.LogError("❌ [ChangePassword] Falló el cambio de contraseña para usuario {UserId}. Errores: {Errors}", 
                request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
            return false;
        }

        logger.LogInformation("✅ [ChangePassword] Contraseña cambiada exitosamente para usuario {UserId}", request.UserId);
        return true;
    }
}
