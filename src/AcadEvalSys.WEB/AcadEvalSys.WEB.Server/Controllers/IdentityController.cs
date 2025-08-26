using AcadEvalSys.Application.Users.Commands.AssignRole;
using AcadEvalSys.Application.Users.Commands.UnassignUserRole;
using AcadEvalSys.Application.Users.Queries;
using AcadEvalSys.Application.Users.Queries.GetCurrentUserInfo;
using AcadEvalSys.Application.Users.Queries.GetSessionStatus;
using AcadEvalSys.Application.Users.Queries.GetAdmins;
using AcadEvalSys.Application.Users.Dtos;
using AcadEvalSys.Application.Users.Commands.CreateAdmin;
using AcadEvalSys.Application.Users.Commands.DeactivateUser;
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
    /// Cierra la sesión del usuario actual y limpia todas las cookies.
    /// </summary>
    /// <returns>NoContent si se cierra la sesión correctamente.</returns>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        //  Cerrar sesión de ASP.NET Core Identity
        await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        
        //  Limpiar todas las cookies de autenticación
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(-1) // Expirar ayer
        };

        // Limpiar cookies principales de autenticación
        Response.Cookies.Delete(".AspNetCore.Identity.Application", cookieOptions);
        Response.Cookies.Delete(".AspNetCore.Identity.External", cookieOptions);
        
        // Limpiar cookies de sesión si las hay
        Response.Cookies.Delete("session", cookieOptions);
        Response.Cookies.Delete("auth", cookieOptions);
        
        
        // Agregar headers para prevenir cache del navegador
        Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        Response.Headers.Append("Pragma", "no-cache");
        Response.Headers.Append("Expires", "0");

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

        /// <summary>
        /// Obtiene la lista paginada de usuarios con rol Administrador.
        /// </summary>
        [HttpGet("admins")]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Produces("application/json")]
        public async Task<IActionResult> GetAdmins([FromQuery] GetAdminsQuery query)
        {
            var result = await mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Crea un usuario con rol Administrador.
        /// </summary>
        [HttpPost("admins")]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminUserCommand command)
        {
            var id = await mediator.Send(command);
            return Created($"/identity/admins/{id}", new { id });
        }

        /// <summary>
        /// Desactiva un usuario (no podrá iniciar sesión).
        /// </summary>
        [HttpPost("deactivate-user")]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeactivateUser([FromBody] DeactivateUserCommand command)
        {
            await mediator.Send(command);
            return NoContent();
        }
}