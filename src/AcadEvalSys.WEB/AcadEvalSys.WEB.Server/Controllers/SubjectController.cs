using AcadEvalSys.Application.Subjects.Commands.AssignProfessor;
using AcadEvalSys.Application.Subjects.Commands.CreateSubject;
using AcadEvalSys.Application.Subjects.Commands.DeleteSubject;
using AcadEvalSys.Application.Subjects.Commands.EnrollStudent;
using AcadEvalSys.Application.Subjects.Commands.UpdateSubject;
using AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;
using AcadEvalSys.Application.Subjects.Queries.GetSubjectById;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de asignaturas. Solo accesible por administradores.
/// </summary>
[ApiController]
[Route("technical-careers/{careerId}/subjects")]
[Authorize(Roles = UserRoles.Admin)]
public class SubjectController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Crea una nueva asignatura en una carrera técnica específica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="command">Datos de la asignatura a crear.</param>
    /// <returns>ID de la asignatura creada.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateSubject(Guid careerId, [FromBody] CreateSubjectCommand command)
    {
        command.TechnicalCareerId = careerId;
        var subjectId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetSubjectById), new { careerId, subjectId }, new { id = subjectId });
    }

    /// <summary>
    /// Obtiene todas las asignaturas de una carrera técnica específica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="year">Año de la asignatura.</param>
    /// <param name="includeEnrolledStudents">Incluir estudiantes inscritos en la respuesta.</param>
    /// <returns>Lista de asignaturas de la carrera.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllSubjects(Guid careerId, [FromQuery] CareerYear? year = null, [FromQuery] bool includeEnrolledStudents = false)
    {
        var query = new GetAllSubjectsQuery { TechnicalCareerId = careerId, Year = year, IncludeEnrolledStudents = includeEnrolledStudents };
        var subjects = await mediator.Send(query);
        return Ok(subjects);
    }

    /// <summary>
    /// Obtiene una asignatura específica de una carrera técnica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="includeEnrolledStudents">Incluir estudiantes inscritos en la respuesta.</param>
    /// <returns>Asignatura solicitada.</returns>
    [HttpGet("{subjectId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetSubjectById(Guid careerId, Guid subjectId, [FromQuery] bool includeEnrolledStudents = false)
    {
        var query = new GetSubjectByIdQuery { Id = subjectId, TechnicalCareerId = careerId, IncludeEnrolledStudents = includeEnrolledStudents };
        var subject = await mediator.Send(query);
        return Ok(subject);
    }

    /// <summary>
    /// Actualiza una asignatura existente en una carrera técnica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura a actualizar.</param>
    /// <param name="command">Datos actualizados de la asignatura.</param>
    /// <returns>NoContent si se actualiza correctamente.</returns>
    [HttpPut("{subjectId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateSubject(Guid careerId, Guid subjectId, [FromBody] UpdateSubjectCommand command)
    {
        command.Id = subjectId;
        command.TechnicalCareerId = careerId;
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Elimina una asignatura de una carrera técnica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura a eliminar.</param>
    /// <returns>NoContent si se elimina correctamente.</returns>
    [HttpDelete("{subjectId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSubject(Guid careerId, Guid subjectId)
    {
        var command = new DeleteSubjectCommand(subjectId, careerId);
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Inscribe un estudiante en una asignatura de una carrera técnica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="command">Datos del estudiante a inscribir.</param>
    /// <returns>Ok si se inscribe correctamente, BadRequest si falla.</returns>
    [HttpPost("{subjectId}/enroll-student")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> EnrollStudent(Guid careerId, Guid subjectId, [FromBody] EnrollStudentInSubjectCommand command)
    {
        command.SubjectId = subjectId;
        command.TechnicalCareerId = careerId;
        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest();
    }

    /// <summary>
    /// Asigna un profesor a una asignatura de una carrera técnica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="command">Datos del profesor a asignar.</param>
    /// <returns>Ok si se asigna correctamente, BadRequest si falla.</returns>
    [HttpPut("{subjectId}/assign-professor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignProfessor(Guid careerId, Guid subjectId, [FromBody] AssignProfessorToSubjectCommand command)
    {
        command.SubjectId = subjectId;
        command.TechnicalCareerId = careerId;
        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest();
    }
}