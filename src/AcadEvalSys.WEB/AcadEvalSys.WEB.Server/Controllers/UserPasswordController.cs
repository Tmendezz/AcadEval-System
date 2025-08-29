using AcadEvalSys.Application.Users.Commands.GenerateTemporaryPassword;
using AcadEvalSys.Application.Users.Commands.ResetPassword;
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
    /// Resetear contraseña de un usuario
    /// </summary>
    [HttpPost("reset")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetUserPasswordRequest request)
    {
        try
        {
            var command = new ResetUserPasswordCommand
            {
                UserId = request.UserId,
                NewPassword = request.NewPassword
            };

            var result = await _mediator.Send(command);
            return Ok(new { message = "Contraseña reseteada exitosamente", userId = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Generar contraseña temporal para un usuario
    /// </summary>
    [HttpPost("generate-temporary")]
    public async Task<IActionResult> GenerateTemporaryPassword([FromBody] GenerateTemporaryPasswordRequest request)
    {
        try
        {
            var command = new GenerateTemporaryPasswordCommand
            {
                UserId = request.UserId
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class ResetUserPasswordRequest
{
    public string UserId { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class GenerateTemporaryPasswordRequest
{
    public string UserId { get; set; } = string.Empty;
}
