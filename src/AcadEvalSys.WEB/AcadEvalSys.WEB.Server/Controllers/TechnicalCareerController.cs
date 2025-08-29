using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.DeleteTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.AssignCoordinator;
using AcadEvalSys.Application.TechnicalCareers.Commands.RemoveCoordinator;
using AcadEvalSys.Application.TechnicalCareers.Commands.ImportStudents;
using AcadEvalSys.Application.TechnicalCareers.Commands.AddStudentToCareer;
using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Application.TechnicalCareers.Queries.GetAllTechnicalCareers;
using AcadEvalSys.Application.TechnicalCareers.Queries.GetTechnicalCareerById;
using AcadEvalSys.Application.TechnicalCareers.Queries.GetCareerCoordinator;
using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Application.TechnicalCareers.Commands.RevokeExpiredEnrollments;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;
/// <summary>
/// Controlador para la gestión de carreras técnicas. Solo accesible por administradores.
/// </summary>
[ApiController]
[Route("technical-careers")]
[Authorize(Roles = UserRoles.Admin)]
public class TechnicalCareerController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene todas las carreras técnicas.
    /// </summary>
    /// <returns>Lista de carreras técnicas.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<IEnumerable<TechnicalCareerDto>>> GetAllCareers()
    {
        var careers = await mediator.Send(new GetAllTechnicalCareersQuery());
        return Ok(careers);
    }

    /// <summary>
    /// Obtiene una carrera técnica por su ID.
    /// </summary>
    /// <param name="id">ID de la carrera técnica.</param>
    /// <returns>Carrera técnica solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<TechnicalCareerDto>> GetById([FromRoute] Guid id)
    {
        var career = await mediator.Send(new GetTechnicalCareerByIdQuery(id));
        return Ok(career);
    }

    /// <summary>
    /// Crea una nueva carrera técnica.
    /// </summary>
    /// <param name="command">Datos de la carrera técnica a crear.</param>
    /// <returns>ID de la carrera técnica creada.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> CreateCareer(CreateTechnicalCareerCommand command)
    {
        var id = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    /// <summary>
    /// Actualiza una carrera técnica existente.
    /// </summary>
    /// <param name="id">ID de la carrera técnica a actualizar.</param>
    /// <param name="command">Datos actualizados de la carrera técnica.</param>
    /// <returns>NoContent si se actualiza correctamente.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCareer([FromRoute] Guid id, [FromBody] UpdateTechnicalCareerCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    /// <summary>
    /// Elimina una carrera técnica por su ID.
    /// </summary>
    /// <param name="id">ID de la carrera técnica a eliminar.</param>
    /// <returns>NoContent si se elimina correctamente.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCareer([FromRoute] Guid id)
    {
        await mediator.Send(new DeleteTechnicalCareerCommand(id));
        return NoContent();
    }

        /// <summary>
        /// Asigna un coordinador a una carrera técnica.
        /// </summary>
        [HttpPut("{id}/coordinator")]
        public async Task<IActionResult> AssignCoordinator([FromRoute] Guid id, [FromBody] AssignCoordinatorCommand command)
        {
            command.TechnicalCareerId = id;
            await mediator.Send(command);
            return NoContent();
        }

        /// <summary>
        /// Quita el coordinador de una carrera técnica.
        /// </summary>
        /// <param name="id">ID de la carrera técnica.</param>
        /// <returns>NoContent si se elimina correctamente.</returns>
        [HttpDelete("{id}/coordinator")]
        public async Task<IActionResult> RemoveCoordinator([FromRoute] Guid id)
        {
            await mediator.Send(new RemoveCoordinatorCommand { TechnicalCareerId = id });
            return NoContent();
        }

        /// <summary>
        /// Importa estudiantes desde un archivo CSV/Excel a una carrera técnica.
        /// </summary>
        /// <param name="id">ID de la carrera técnica.</param>
        /// <param name="file">Archivo CSV/Excel con los datos de los estudiantes.</param>
        /// <returns>Resultado de la importación.</returns>
        [HttpPost("{id}/import-students")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public async Task<IActionResult> ImportStudents(Guid id, IFormFile file)
        {
            var command = new ImportStudentsToCareerCommand
            {
                TechnicalCareerId = id,
                File = file
            };
            var result = await mediator.Send(command);
            return Ok(result);
        }

        /// <summary>
        /// Crea un nuevo estudiante en una carrera técnica específica.
        /// </summary>
        /// <param name="id">ID de la carrera técnica.</param>
        /// <param name="command">Datos del estudiante a crear.</param>
        /// <returns>ID del estudiante creado.</returns>
        [HttpPost("{id}/students")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Produces("application/json")]
        public async Task<IActionResult> AddStudentToCareer(Guid id, [FromBody] AddStudentToCareerCommand command)
        {
            command.TechnicalCareerId = id;
            var studentId = await mediator.Send(command);
            return CreatedAtAction("GetStudentById", "Student", new { id = studentId }, new { id = studentId });
        }

    /// <summary>
    /// Obtiene el coordinador de una carrera técnica por su ID.
    /// </summary>
    /// <param name="id">ID de la carrera técnica.</param>
    /// <returns>Datos del coordinador de la carrera técnica.</returns>
    [HttpGet("{id}/coordinator")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<ActionResult<GetCareerCoordinatorDto>> GetCareerCoordinator([FromRoute] Guid id)
    {
        var coordinator = await mediator.Send(new GetCareerCoordinatorQuery { TechnicalCareerId = id });
        if (coordinator == null)
        {
            return NotFound();
        }
        return Ok(coordinator);
    }

        /// <summary>
        /// Revoca las inscripciones expiradas del año anterior
        /// </summary>
        /// <param name="id">ID de la carrera técnica.</param>
        /// <param name="command">Comando para revocar inscripciones.</param>
        /// <returns>Resultado de la revocación.</returns>
        [HttpPost("{id}/revoke-expired-enrollments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Produces("application/json")]
        public async Task<ActionResult<RevokeExpiredEnrollmentsResult>> RevokeExpiredEnrollments([FromRoute] Guid id, [FromBody] RevokeExpiredEnrollmentsCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
}