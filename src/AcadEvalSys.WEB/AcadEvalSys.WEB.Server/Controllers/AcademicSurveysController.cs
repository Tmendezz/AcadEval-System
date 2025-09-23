using AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey;
using AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey;
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
    public async Task<IActionResult> CloseSurvey([FromRoute]Guid id, [FromQuery] bool force, [FromBody] CloseAcademicSurveyCommand command)
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

    // Analytics endpoints
    [HttpGet("{id}/analytics/summary")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetSurveyAnalyticsSummary([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetSurveyAnalyticsByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("{id}/analytics/audience")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> GetSurveyAudienceAnalytics([FromRoute] Guid id, [FromQuery] Guid careerId, [FromQuery] string year)
    {
        if (!Enum.TryParse<Domain.Enums.CareerYear>(year, true, out var careerYear))
        {
            return BadRequest(new { message = "Parámetro 'year' inválido. Valores válidos: First, Second, Third" });
        }

        var result = await mediator.Send(new GetSurveyAudienceResponsesQuery(id, careerId, careerYear));
        return Ok(result);
    }
}
