using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;
using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignmentById;
using AcadEvalSys.Application.Professors.Commands.AddProfessor;
using AcadEvalSys.Application.Professors.Commands.RemoveProfessor;
using AcadEvalSys.Application.Professors.Commands.UpdateProfessor;
using AcadEvalSys.Application.Professors.Queries.GetAllProfessors;
using AcadEvalSys.Application.Professors.Queries.GetProfessor;
using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;

using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetAllStudentCompetencyAssessment;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controlador para la gestión de profesores y sus asignaciones.
/// </summary>
[ApiController]
[Route("professors")]
public class ProfessorController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Crea un nuevo profesor. Solo los administradores pueden crear profesores.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateProfessor([FromBody] AddProfessorCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetProfessorById), new { id = result }, new { id = result });
    }

    /// <summary>
    /// Obtiene todos los profesores con paginación y filtrado.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllProfessors([FromQuery] GetAllProfessorsQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene un profesor específico por su ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetProfessorById(string id)
    {
        var query = new GetProfessorByIdQuery(id);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Actualiza la información de un profesor. Solo los administradores pueden actualizar profesores.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfessor(string id, [FromBody] UpdateProfessorCommand command)
    {
        command.UserId = id;
        var result = await mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    /// <summary>
    /// Elimina un profesor. Solo los administradores pueden eliminar profesores.
    /// Si el profesor tiene asignaturas asignadas, devuelve información sobre las asignaciones.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> DeleteProfessor(string id)
    {
        var command = new RemoveProfessorCommand(id);
        var result = await mediator.Send(command);
        
        if (result.Success)
        {
            return NoContent();
        }
        
        if (result.HasAssignments)
        {
            return BadRequest(new
            {
                message = result.Message,
                hasAssignments = result.HasAssignments,
                assignedSubjects = result.AssignedSubjects
            });
        }
        
        return NotFound(new { message = result.Message });
    }

    /// <summary>
    /// Obtiene las asignaciones de un profesor, opcionalmente filtradas por instancia de evaluación.
    /// </summary>
    /// <param name="professorId">ID del profesor.</param>
    /// <param name="evaluationInstanceId">ID de la instancia de evaluación (opcional).</param>
    /// <returns>Lista de asignaciones.</returns>
    [HttpGet("{professorId}/assignments")]
    public async Task<IActionResult> GetProfessorAssignments(
        string professorId,
        [FromQuery] Guid? evaluationInstanceId = null)
    {
        var query = new GetProfessorAssignmentsQuery(professorId, evaluationInstanceId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene una asignación específica de profesor por su ID.
    /// </summary>
    /// <param name="assignmentId">ID de la asignación.</param>
    /// <returns>Detalles de la asignación.</returns>
    [HttpGet("assignments/{assignmentId}")]
    public async Task<IActionResult> GetProfessorAssignmentById(Guid assignmentId)
    {
        var query = new GetProfessorAssignmentByIdQuery(assignmentId);
        var result = await mediator.Send(query);
        
        if (result == null)
        {
            return NotFound($"No se encontró la asignación con ID {assignmentId}");
        }
        
        return Ok(result);
    }

    /// <summary>
    /// Obtiene los estudiantes asignados a una asignación de profesor.
    /// </summary>
    /// <param name="assignmentId">ID de la asignación.</param>
    /// <returns>Lista de estudiantes.</returns>
    [HttpGet("assignments/{assignmentId}/students")]
    public async Task<IActionResult> GetAssignmentStudents(Guid assignmentId)
    {
        var query = new GetAllStudentCompetencyAssessmentQuery(assignmentId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Evalúa la competencia de un estudiante en una asignación.
    /// </summary>
    /// <param name="assignmentId">ID de la asignación.</param>
    /// <param name="studentId">ID del estudiante.</param>
    /// <param name="request">Datos de la evaluación.</param>
    /// <returns>ID de la evaluación realizada.</returns>
    [HttpPost("assignments/{assignmentId}/students/{studentId}/evaluate")]
    public async Task<IActionResult> EvaluateStudentCompetency(
        Guid assignmentId,
        string studentId,
        [FromBody] CompleteStudentAssessmentCommand request)
    {
        request.ProfessorCompetencyAssignmentId = assignmentId;
        request.StudentId = studentId;

        var result = await mediator.Send(request);
        return Ok(new { AssessmentId = result });
    }

}
