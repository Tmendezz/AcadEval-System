using AcadEvalSys.Application.Templates.Commands.CreateTemplate;
using AcadEvalSys.Application.Templates.Commands.DeleteTemplate;
using AcadEvalSys.Application.Templates.Commands.UpdateTemplate;
using AcadEvalSys.Application.Templates.Queries.GetTemplateById;
using AcadEvalSys.Application.Templates.Queries.GetTemplates;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de plantillas de encuestas. Solo accesible por administradores.
/// </summary>
[ApiController]
[Route("survey-templates")]
[Authorize(Roles = UserRoles.Admin)]
public class SurveyTemplateController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene todas las plantillas de encuestas con filtros opcionales.
    /// </summary>
    /// <param name="surveyType">Tipo de encuesta (opcional).</param>
    /// <param name="isDraft">Filtrar por borradores (opcional).</param>
    /// <param name="searchTerm">Término de búsqueda (opcional).</param>
    /// <returns>Lista de plantillas de encuestas.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetTemplates(
        [FromQuery] SurveyType? surveyType = null,
        [FromQuery] bool? isDraft = null,
        [FromQuery] string? searchTerm = null)
    {
        var query = new GetSurveyTemplatesQuery
        {
            SurveyType = surveyType,
            IsDraft = isDraft,
            SearchTerm = searchTerm
        };

        var templates = await mediator.Send(query);
        return Ok(templates);
    }

    /// <summary>
    /// Obtiene una plantilla de encuesta específica por su ID.
    /// </summary>
    /// <param name="id">ID de la plantilla de encuesta.</param>
    /// <returns>Plantilla de encuesta solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetTemplateById(Guid id)
    {
        var template = await mediator.Send(new GetSurveyTemplateByIdQuery(id));
        return Ok(template);
    }

    /// <summary>
    /// Crea una nueva plantilla de encuesta.
    /// </summary>
    /// <param name="command">Datos de la plantilla a crear.</param>
    /// <returns>ID de la plantilla creada.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateSurveyTemplateCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetTemplateById), new { id }, null);
    }

    /// <summary>
    /// Actualiza una plantilla de encuesta existente.
    /// </summary>
    /// <param name="id">ID de la plantilla a actualizar.</param>
    /// <param name="command">Datos actualizados de la plantilla.</param>
    /// <returns>NoContent si se actualiza correctamente.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTemplate([FromRoute] Guid id, [FromBody] UpdateSurveyTemplateCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Elimina una plantilla de encuesta por su ID.
    /// </summary>
    /// <param name="id">ID de la plantilla a eliminar.</param>
    /// <returns>NoContent si se elimina correctamente.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        await mediator.Send(new DeleteSurveyTemplateCommand { Id = id });
        return NoContent();
    }
}