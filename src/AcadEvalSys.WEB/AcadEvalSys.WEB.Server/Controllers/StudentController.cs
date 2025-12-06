using AcadEvalSys.Application.Students.Commands.AddStudent;
using AcadEvalSys.Application.Students.Commands.RemoveStudent;
using AcadEvalSys.Application.Students.Commands.UpdateStudent;
using AcadEvalSys.Application.Users.Commands.ChangePassword;
using AcadEvalSys.Application.Students.Queries.GetAllStudents;
using AcadEvalSys.Application.Students.Queries.GetStudent;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controlador para la gestión de estudiantes.
/// </summary>
[ApiController]
[Route("students")]
public class StudentController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Crea un nuevo estudiante. Solo los administradores pueden crear estudiantes.
    /// </summary>
    /// <remarks>
    /// Solo los administradores pueden crear nuevos estudiantes.
    /// </remarks>
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateStudent([FromBody] AddStudentCommand command)
    {
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetStudentById), new { id = result }, new { id = result });
    }

    /// <summary>
    /// Obtiene todos los estudiantes con paginación y filtrado.
    /// </summary>
    /// <remarks>
    /// Permite obtener la lista completa de estudiantes con paginación y filtrado.
    /// Solo los administradores y profesores tienen acceso.
    /// </remarks>
    [HttpGet]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllStudents([FromQuery] GetAllStudentsQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene un estudiante específico por su ID.
    /// </summary>
    /// <remarks>
    /// Permite obtener los detalles de un estudiante específico por su ID.
    /// Solo los administradores, profesores y estudiantes tienen acceso.
    /// </remarks>
    [HttpGet("{id}")]
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor},{UserRoles.Student}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetStudentById(string id)
    {
        var query = new GetStudentByIdQuery(id);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Actualiza la información de un estudiante. Solo los administradores pueden actualizar estudiantes.
    /// </summary>
    /// <remarks>
    /// Permite actualizar la información de un estudiante existente.
    /// Solo los administradores tienen acceso.
    /// </remarks>
    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStudent(string id, [FromBody] UpdateStudentCommand command)
    {
        command.UserId = id;
        var result = await mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    /// <summary>
    /// Elimina un estudiante. Solo los administradores pueden eliminar estudiantes.
    /// </summary>
    /// <remarks>
    /// Permite eliminar un estudiante existente.
    /// Solo los administradores tienen acceso.
    /// </remarks>
    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        var command = new RemoveStudentCommand(id);
        var result = await mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    /// <summary>
    /// Cambia la contraseña de un estudiante. Solo los administradores pueden cambiar contraseñas.
    /// </summary>
    /// <remarks>
    /// Permite cambiar la contraseña de un estudiante existente.
    /// Solo los administradores tienen acceso.
    /// </remarks>
    [HttpPost("{id}/change-password")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordRequest request)
    {
        var command = new ChangePasswordCommand(id, request.NewPassword);
        var result = await mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    public class ChangePasswordRequest
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}