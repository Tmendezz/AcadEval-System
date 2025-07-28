using AcadEvalSys.Application.Competencies.Commands.CreateCompetency;
using AcadEvalSys.Application.Competencies.Commands.DeleteCompetency;
using AcadEvalSys.Application.Competencies.Commands.UpdateCompetency;
using AcadEvalSys.Application.Competencies.Queries.GetAllCompetencies;
using AcadEvalSys.Application.Competencies.Queries.GetCompetency;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de competencias. Solo accesible por administradores.
/// </summary>
[ApiController]
[Route("competencies")]
[Authorize(Roles = UserRoles.Admin)]
public class CompetencyController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene todas las competencias.
    /// </summary>
    /// <returns>Lista de competencias.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetCompetencies()
    {
        var competencies = await mediator.Send(new GetAllCompetenciesQuery());
        return Ok(competencies);
    }

    /// <summary>
    /// Obtiene una competencia específica por su ID.
    /// </summary>
    /// <param name="id">ID de la competencia.</param>
    /// <returns>Competencia solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetCompetency(Guid id)
    {
        var competency = await mediator.Send(new GetCompetencyQuery(id));
        return Ok(competency);
    }

    /// <summary>
    /// Crea una nueva competencia.
    /// </summary>
    /// <param name="command">Datos de la competencia a crear.</param>
    /// <returns>ID de la competencia creada.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateCompetency([FromBody] CreateCompetencyCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetCompetency), new { id }, null);
    }

    /// <summary>
    /// Actualiza una competencia existente.
    /// </summary>
    /// <param name="id">ID de la competencia a actualizar.</param>
    /// <param name="command">Datos actualizados de la competencia.</param>
    /// <returns>NoContent si se actualiza correctamente.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCompetency([FromRoute] Guid id, [FromBody] UpdateCompetencyCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Elimina una competencia por su ID.
    /// </summary>
    /// <param name="id">ID de la competencia a eliminar.</param>
    /// <returns>NoContent si se elimina correctamente.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCompetency(Guid id)
    {
        await mediator.Send(new DeleteCompetencyCommand(id));
        return NoContent();
    }
}