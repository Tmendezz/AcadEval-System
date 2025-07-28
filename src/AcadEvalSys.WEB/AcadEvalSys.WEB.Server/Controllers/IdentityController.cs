using AcadEvalSys.Application.Users.Commands.AssignRole;
using AcadEvalSys.Application.Users.Commands.UnassignUserRole;
using AcadEvalSys.Application.Users.Queries;
using AcadEvalSys.Application.Users.Queries.GetCurrentUserInfo;
using AcadEvalSys.Application.Users.Queries.GetSessionStatus;
using AcadEvalSys.Application.Users.Dtos;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de identidad y roles de usuario.
/// </summary>
[Route("identity")]
[Tags("Identity")]
[ApiController]
public class IdentityController(IMediator mediator) : ControllerBase
{

    /// <summary>
    /// Cierra la sesión del usuario actual.
    /// </summary>
    /// <returns>NoContent si se cierra la sesión correctamente.</returns>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        return NoContent();
    }

    /// <summary>
    /// Asigna un rol a un usuario. Solo administradores.
    /// </summary>
    /// <param name="command">Datos del usuario y rol a asignar.</param>
    /// <returns>NoContent si se asigna correctamente.</returns>
    [HttpPost("userRole")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignUserRole([FromBody] AssignUserRoleCommand command)
    {
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Quita un rol a un usuario. Solo administradores.
    /// </summary>
    /// <param name="command">Datos del usuario y rol a quitar.</param>
    /// <returns>NoContent si se quita correctamente.</returns>
    [HttpDelete("userRole")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveUserRole([FromBody] UnassingUserRoleCommand command)
    {
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Obtiene la información del usuario actual.
    /// </summary>
    /// <returns>Información del usuario.</returns>
    [HttpGet("info")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetUserInfo()
    {
        var user = await mediator.Send(new GetCurrentUserInfoQuery());
        return Ok(user);
    }


    /// <summary>
    /// Verifica el estado de la sesión actual.
    /// </summary>
    /// <returns>Estado de la sesión.</returns>
    [HttpGet("session-check")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<SessionStatusDto>> GetSessionCheck()
    {
        var sessionStatus = await mediator.Send(new GetSessionStatusQuery());
        return Ok(sessionStatus);
    }
}