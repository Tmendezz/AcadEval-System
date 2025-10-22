using AcadEvalSys.Application.Users.Commands.GenerateTemporaryPassword;
using AcadEvalSys.Application.Users.Commands.ChangePassword;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("user-password")]
[Authorize(Roles = "Admin")]
public class UserPasswordController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserPasswordController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Endpoint de prueba para verificar que el controlador esté funcionando
    /// </summary>
    [HttpGet]
    public IActionResult Test()
    {
        return Ok(new { message = "UserPasswordController está funcionando correctamente" });
    }

    /// <summary>
    /// Cambiar contraseña de un usuario
    /// </summary>
    [HttpPost("change")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangeUserPasswordRequest request)
    {
        // Logs detallados para debugging
        var logger = HttpContext.RequestServices.GetRequiredService<ILogger<UserPasswordController>>();
        
        logger.LogInformation("📨 [Controller] Recibida solicitud de cambio de contraseña");
        logger.LogInformation("📨 [Controller] UserId: {UserId}", request?.UserId ?? "NULL");
        logger.LogInformation("📨 [Controller] Password length: {Length}", request?.NewPassword?.Length ?? 0);
        logger.LogInformation("📨 [Controller] Password is null or empty: {IsNullOrEmpty}", string.IsNullOrEmpty(request?.NewPassword));
        logger.LogWarning("🔐 [Controller] DEBUGGING - Nueva contraseña recibida: '{Password}'", request?.NewPassword ?? "NULL");
        
        if (request == null)
        {
            logger.LogError("❌ [Controller] Request body es NULL");
            return BadRequest(new { error = "Request inválido" });
        }
        
        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            logger.LogError("❌ [Controller] UserId es NULL o vacío");
            return BadRequest(new { error = "UserId es requerido" });
        }
        
        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            logger.LogError("❌ [Controller] NewPassword es NULL o vacío");
            return BadRequest(new { error = "Nueva contraseña es requerida" });
        }
        
        var command = new ChangePasswordCommand(request.UserId, request.NewPassword);
        var result = await _mediator.Send(command);
        
        if (result)
        {
            logger.LogInformation("✅ [Controller] Contraseña cambiada exitosamente para {UserId}", request.UserId);
            return Ok(new { message = "Contraseña cambiada exitosamente", userId = request.UserId });
        }
        else
        {
            logger.LogWarning("⚠️ [Controller] No se pudo cambiar la contraseña para {UserId}", request.UserId);
            return NotFound(new { error = "Usuario no encontrado" });
        }
    }

    /// <summary>
    /// Generar contraseña temporal para un usuario
    /// </summary>
    [HttpPost("generate-temporary")]
    public async Task<IActionResult> GenerateTemporaryPassword([FromBody] GenerateTemporaryPasswordRequest request)
    {
        var command = new GenerateTemporaryPasswordCommand
        {
            UserId = request.UserId
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}

public class ChangeUserPasswordRequest
{
    public string UserId { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class GenerateTemporaryPasswordRequest
{
    public string UserId { get; set; } = string.Empty;
}
