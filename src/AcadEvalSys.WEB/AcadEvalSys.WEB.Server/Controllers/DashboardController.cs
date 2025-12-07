using AcadEvalSys.Application.Dashboard.Queries.GetDashboardStats;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para obtener estadísticas del dashboard.
/// </summary>
[ApiController]
[Route("dashboard")]
[Tags("Dashboard")]
[Authorize(Roles = UserRoles.Admin)]
public class DashboardController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene las estadísticas del dashboard.
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Produces("application/json")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var query = new GetDashboardStatsQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }
}

