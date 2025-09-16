using AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.SetSurveySubjects;
using AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyResponses;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectResponses;
using AcadEvalSys.Application.AcademicSurveys.Queries.ListAcademicSurveys;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("surveys")]
[Authorize(Roles = UserRoles.Admin)]
public class AcademicSurveyController(IMediator mediator) : ControllerBase
{
    [HttpPost]
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

    [HttpPut("{id}/subjects")]
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> List([FromQuery] ListAcademicSurveysQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetAcademicSurveyByIdQuery { Id = id });
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("subjects/{surveySubjectId}/responses")]
    [Authorize(Roles = $"{UserRoles.Student},{UserRoles.Professor}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitResponse(Guid surveySubjectId, [FromBody] SubmitSurveyResponseCommand command)
    { 
        command.AcademicSurveySubjectId = surveySubjectId;
        var id = await mediator.Send(command);
        return Ok(new { id }); 
    }

    // GET /surveys/{id}/responses  (solo Admin)
    [HttpGet("{id}/responses")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSurveyResponses([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetSurveyResponsesQuery(id));
        return Ok(result);
    }

    // GET /surveys/subjects/{surveySubjectId}/responses (solo Admin)
    [HttpGet("subjects/{surveySubjectId}/responses")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSurveySubjectResponses(Guid surveySubjectId)
    {
        var result = await mediator.Send(new GetSurveySubjectResponsesQuery(surveySubjectId));
        return Ok(result);
    }
}
