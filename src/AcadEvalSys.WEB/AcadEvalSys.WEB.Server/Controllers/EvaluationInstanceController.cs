using AcadEvalSys.Application.Evaluations.Commands.CreateInstance;
using AcadEvalSys.Application.Evaluations.Commands.DeleteInstance;
using AcadEvalSys.Application.Evaluations.Commands.FinalizeEvaluationInstance;
using AcadEvalSys.Application.Evaluations.Commands.UpdateEvaluationInfoInstance;
using AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstanceById;
using AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstances;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("evaluation-instances")]
[Authorize(Roles = UserRoles.Admin)]
public class EvaluationInstanceController(IMediator mediator) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetAllEvaluationInstances()
    {
        var competenciesEvaluationInstances = await mediator.Send(new GetAllEvaluationInstancesQuery());
        return Ok(competenciesEvaluationInstances);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvaluationInstanceById(Guid id)
    {
        var competenciesEvaluationInstance = await mediator.Send(new GetEvaluationInstanceByIdQuery(id));
        return Ok(competenciesEvaluationInstance);
    }


    [HttpPost]
    public async Task<IActionResult> CreateEvaluationInstance([FromBody] CreateEvaluationInstanceCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetEvaluationInstanceById), new { id }, new { id });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvaluationInstance([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteEvaluationInstanceCommand(id));
        return NoContent();
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvaluationInstance([FromBody] UpdateEvaluationInstanceCommand command, [FromRoute] Guid id)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Finalizes an evaluation instance. Only accessible to administrators.
    /// </summary>
    /// <param name="id">Evaluation instance ID</param>
    /// <param name="forceClose">Force close even if not all professors completed their assignments</param>
    /// <returns>Success status</returns>
    [HttpPost("{id}/finalize")]
    public async Task<IActionResult> FinalizeEvaluationInstance(
        [FromRoute] Guid id, 
        [FromQuery] bool forceClose = false)
    {
        var command = new FinalizeEvaluationInstanceCommand(id, forceClose);
        var result = await mediator.Send(command);
        
        return Ok(new { 
            Success = result, 
            Message = result 
                ? "Evaluation instance finalized successfully" 
                : "Failed to finalize evaluation instance"
        });
    }
}
