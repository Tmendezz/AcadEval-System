using AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.SetSurveySubjects;
using AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetAudienceResponses;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyResponses;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectResponses;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsByAudience;
using AcadEvalSys.Application.AcademicSurveys.Queries.ListAcademicSurveys;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión administrativa de encuestas académicas.
/// Solo accesible por administradores y operaciones de consulta general.
/// </summary>
[ApiController]
[Route("surveys")]
[Authorize] // Base authorization - specific roles defined per endpoint
public class AcademicSurveyController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> Create([FromBody] CreateAcademicSurveyCommand command)
    {
        try
        {
            Log.Information("Recibida solicitud para crear encuesta: {Title}", command.Title);
            
            var id = await mediator.Send(command);
            
            Log.Information("Encuesta creada exitosamente con ID: {Id}", id);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al crear encuesta: {Title}", command.Title);
            throw;
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateAcademicSurveyCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{id}/subjects")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can set subjects
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> SetSubjects([FromRoute] Guid id, [FromBody] SetSurveySubjectsCommand command)
    {
        command.SurveyId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{id}/publish")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can publish surveys
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> Publish([FromRoute] Guid id, [FromBody] PublishAcademicSurveyCommand command)
    {
        command.SurveyId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{id}/close")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can close surveys
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> Close([FromRoute] Guid id, [FromBody] CloseAcademicSurveyCommand command)
    {
        command.SurveyId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpGet]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor},{UserRoles.Student}")] // All authenticated users can list surveys
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> List([FromQuery] ListAcademicSurveysQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }


    [HttpGet("{id}")]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor},{UserRoles.Student}")] // All authenticated users can view individual surveys
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetAcademicSurveyByIdQuery { Id = id });
        return result is null ? NotFound() : Ok(result);
    }


    // GET /surveys/{id}/responses  (solo Admin)
    [HttpGet("{id}/responses")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can view responses
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSurveyResponses([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetSurveyResponsesQuery(id));
        return Ok(result);
    }

    // GET /surveys/subjects/{surveySubjectId}/responses (solo Admin)
    [HttpGet("subjects/{surveySubjectId}/responses")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can view subject responses
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSurveySubjectResponses(Guid surveySubjectId)
    {
        var result = await mediator.Send(new GetSurveySubjectResponsesQuery(surveySubjectId));
        return Ok(result);
    }

    // GET /surveys/{id}/subjects-by-audience?career=Nombre&year=1 (Admin)
    [HttpGet("{id}/subjects-by-audience")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubjectsByAudience([FromRoute] Guid id, [FromQuery] string career, [FromQuery] int year)
    {
        var result = await mediator.Send(new GetSurveySubjectsByAudienceQuery
        {
            SurveyId = id,
            TechnicalCareerName = career,
            Year = year
        });
        return Ok(result);
    }

    // GET /surveys/{id}/audience-responses?careerId={guid}&year={n}&role=Student
    [HttpGet("{id}/audience-responses")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAudienceResponses([FromRoute] Guid id, [FromQuery] Guid careerId, [FromQuery] int year)
    {
        var result = await mediator.Send(new GetAudienceResponsesQuery
        {
            SurveyId = id,
            CareerId = careerId,
            Year = year
        });
        return Ok(result);
    }
}
