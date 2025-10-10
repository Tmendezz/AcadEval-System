using AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.DeleteAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurveyById;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetAllAcademicSurveys;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAnalyticsById;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAudienceResponses;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("surveys")]
[Authorize]
public class AcademicSurveysController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> CreateSurvey(CreateAcademicSurveyCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetSurveyById), new { id }, new { id });
    }

    [HttpPut("{id}/publish")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> PublishSurvey([FromRoute] Guid id, [FromBody] PublishAcademicSurveyCommand command)
    {
        command.SurveyId = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> UpdateSurvey(Guid id, UpdateAcademicSurveyCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }
    

    [HttpPut("{id}/close")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> CloseSurvey([FromRoute]Guid id, [FromQuery] bool force)
    {
        await mediator.Send(new CloseAcademicSurveyCommand(id, force));
        return NoContent();
    }

    [HttpGet]
    [Authorize(Roles = $"{UserRoles.Admin}")]
    public async Task<ActionResult<IEnumerable<AcademicSurveyDto>>> GetAllSurveys(
        [FromQuery] SurveyStatus? status = null,
        [FromQuery] string? search = null)
    {
        
        var query = new GetAllAcademicSurveysQuery(
            status,
            search
        );

        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = $"{UserRoles.Admin}")]
    public async Task<IActionResult> GetSurveyById([FromRoute] Guid id )
    {
        var result = await mediator.Send(new GetAcademicSurveyByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("{id}/analytics/summary")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetSurveyAnalyticsSummary([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetSurveyAnalyticsByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("{id}/analytics/audience")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetSurveyAudienceAnalytics([FromRoute] Guid id, [FromQuery] Guid careerId, [FromQuery] CareerYear year)
    {
        var result = await mediator.Send(new GetSurveyAudienceResponsesQuery(id, careerId, year));
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteSurvey([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteAcademicSurveyCommand { Id = id });
        return NoContent();
    }
}
