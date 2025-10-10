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
        var command = new ChangePasswordCommand(request.UserId, request.NewPassword);
        var result = await _mediator.Send(command);
        
        if (result)
        {
            return Ok(new { message = "Contraseña cambiada exitosamente", userId = request.UserId });
        }
        else
        {
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
