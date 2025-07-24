using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.DeleteTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Application.TechnicalCareers.Queries.GetAllTechnicalCareers;
using AcadEvalSys.Application.TechnicalCareers.Queries.GetTechnicalCareerById;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;
[ApiController]
[Route("technical-careers")]
[Authorize(Roles = UserRoles.Admin)]
public class TechnicalCareerController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TechnicalCareerDto>>> GetAllCareers()
    {
        var careers = await mediator.Send(new GetAllTechnicalCareersQuery());
        return Ok(careers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TechnicalCareerDto>> GetById([FromRoute] Guid id)
    {
        var career = await mediator.Send(new GetTechnicalCareerByIdQuery(id));
        return Ok(career);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCareer(CreateTechnicalCareerCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCareer([FromRoute] Guid id, [FromBody] UpdateTechnicalCareerCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCareer([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteTechnicalCareerCommand(id));
        return NoContent();
    }
}