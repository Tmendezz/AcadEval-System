using AcadEvalSys.Application.Evaluations.Commands.CreateInstance;
using AcadEvalSys.Application.Evaluations.Commands.DeleteInstance;
using AcadEvalSys.Application.Evaluations.Commands.FinalizeEvaluationInstance;
using AcadEvalSys.Application.Evaluations.Commands.UpdateEvaluationInfoInstance;
using AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstanceById;
using AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstances;
using AcadEvalSys.Application.Evaluations.Queries.GetCareerYearAssignmentDetails;
using AcadEvalSys.Application.Evaluations.Queries.GetAssignmentStudents;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de instancias de evaluación. Solo accesible por administradores.
/// </summary>
[ApiController]
[Route("evaluation-instances")]
[Authorize(Roles = UserRoles.Admin)]
public class EvaluationInstanceController(IMediator mediator) : ControllerBase
{

    /// <summary>
    /// Obtiene todas las instancias de evaluación.
    /// </summary>
    /// <returns>Lista de instancias de evaluación.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllEvaluationInstances()
    {
        var competenciesEvaluationInstances = await mediator.Send(new GetAllEvaluationInstancesQuery());
        return Ok(competenciesEvaluationInstances);
    }


    /// <summary>
    /// Obtiene una instancia de evaluación por su ID.
    /// </summary>
    /// <param name="id">ID de la instancia de evaluación.</param>
    /// <returns>Instancia de evaluación solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetEvaluationInstanceById(Guid id)
    {
        var competenciesEvaluationInstance = await mediator.Send(new GetEvaluationInstanceByIdQuery(id));
        return Ok(competenciesEvaluationInstance);
    }


    /// <summary>
    /// Crea una nueva instancia de evaluación.
    /// </summary>
    /// <param name="command">Datos de la instancia a crear.</param>
    /// <returns>ID de la instancia creada.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateEvaluationInstance([FromBody] CreateEvaluationInstanceCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetEvaluationInstanceById), new { id }, new { id });
    }


    /// <summary>
    /// Elimina una instancia de evaluación por su ID.
    /// </summary>
    /// <param name="id">ID de la instancia a eliminar.</param>
    /// <returns>NoContent si se elimina correctamente.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEvaluationInstance([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteEvaluationInstanceCommand(id));
        return NoContent();
    }


    /// <summary>
    /// Actualiza una instancia de evaluación existente.
    /// </summary>
    /// <param name="command">Datos actualizados de la instancia.</param>
    /// <param name="id">ID de la instancia a actualizar.</param>
    /// <returns>NoContent si se actualiza correctamente.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateEvaluationInstance([FromBody] UpdateEvaluationInstanceCommand command, [FromRoute] Guid id)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }


    /// <summary>
    /// Finaliza una instancia de evaluación.
    /// </summary>
    /// <param name="id">ID de la instancia a finalizar.</param>
    /// <param name="forceClose">Forzar cierre aunque existan evaluaciones pendientes.</param>
    /// <returns>Resultado de la finalización.</returns>
    [HttpPost("{id}/finalize")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> FinalizeEvaluationInstance(
        [FromRoute] Guid id,
        [FromQuery] bool forceClose = false)
    {
        var command = new FinalizeEvaluationInstanceCommand(id, forceClose);
        var result = await mediator.Send(command);

        return Ok(new
        {
            Success = result,
            Message = result
                ? "Evaluation instance finalized successfully"
                : "Failed to finalize evaluation instance"
        });
    }

    /// <summary>
    /// Obtiene los detalles de asignaciones para un año específico de una carrera técnica en una evaluación.
    /// </summary>
    /// <param name="id">ID de la instancia de evaluación.</param>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="year">Año académico (First, Second, Third).</param>
    /// <returns>Lista de detalles de asignaciones con información de estudiantes.</returns>
    [HttpGet("{id}/career-assignments")]
    [AllowAnonymous] // Permitir acceso a profesores, coordinadores y administradores
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> GetCareerYearAssignmentDetails(
        [FromRoute] Guid id,
        [FromQuery] Guid careerId,
        [FromQuery] string year)
    {
        var query = new GetCareerYearAssignmentDetailsQuery(id, careerId, year);
        var assignmentDetails = await mediator.Send(query);
        return Ok(assignmentDetails);
    }

    /// <summary>
    /// Obtiene la lista de estudiantes de una asignación específica con su estado de evaluación.
    /// </summary>
    /// <param name="assignmentId">ID de la asignación de competencia del profesor.</param>
    /// <returns>Lista de estudiantes con su estado de evaluación.</returns>
    [HttpGet("assignments/{assignmentId}/students")]
    [AllowAnonymous] // Allow access for professors, coordinators, and admins
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAssignmentStudents(
        [FromRoute] Guid assignmentId)
    {
        var query = new GetAssignmentStudentsQuery(assignmentId);
        var students = await mediator.Send(query);
        return Ok(students);
    }
}
