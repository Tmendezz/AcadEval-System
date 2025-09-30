using AcadEvalSys.Application.Subjects.Commands.AssignProfessor;
using AcadEvalSys.Application.Subjects.Commands.CreateSubject;
using AcadEvalSys.Application.Subjects.Commands.DeleteSubject;
using AcadEvalSys.Application.Subjects.Commands.EnrollStudent;
using AcadEvalSys.Application.Subjects.Commands.UnenrollStudent;
using AcadEvalSys.Application.Subjects.Commands.UnenrollStudents;
using AcadEvalSys.Application.Subjects.Commands.UpdateSubject;
using AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;
using AcadEvalSys.Application.Subjects.Queries.GetSubjectById;
using AcadEvalSys.Application.Students.Queries.GetAvailableStudents;
using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Application.Students.Commands.RevokeExpiredEnrollments;
using AcadEvalSys.Application.Students.Commands.RevokeEnrollmentsByYear;
using AcadEvalSys.Application.Students.Queries.GetAcademicYearInfo;
using AcadEvalSys.Infrastructure.Services;
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
[Authorize] // Base authorization - specific roles defined per endpoint
public class SubjectController(
    IMediator mediator,
    EnrollmentExpirationBackgroundService backgroundService,
    ILogger<SubjectController> logger) : ControllerBase
{
    /// <summary>
    /// Crea una nueva asignatura en una carrera técnica específica.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="command">Datos de la asignatura a crear.</param>
    /// <returns>ID de la asignatura creada.</returns>
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can create subjects
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
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor},{UserRoles.Student}")] // All authenticated users can view subjects
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
    [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Professor},{UserRoles.Student}")] // All authenticated users can view individual subjects
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
    [Authorize(Roles = UserRoles.Admin)] // Only admin can update subjects
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
    [Authorize(Roles = UserRoles.Admin)] // Only admin can delete subjects
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
    /// Si el año de la asignatura es superior al año actual del estudiante, 
    /// el año del estudiante se actualiza automáticamente.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="command">Datos del estudiante a inscribir.</param>
    /// <returns>Ok si se inscribe correctamente, BadRequest si falla.</returns>
    [HttpPost("{subjectId}/enroll-student")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can enroll students
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
    [Authorize(Roles = UserRoles.Admin)] // Only admin can assign professors
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignProfessor(Guid careerId, Guid subjectId, [FromBody] AssignProfessorToSubjectCommand command)
    {
        command.SubjectId = subjectId;
        command.TechnicalCareerId = careerId;
        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest();
    }

    // DEPRECATED: Endpoint de importación de estudiantes a nivel de asignatura eliminado.
    // REEMPLAZADO POR: TechnicalCareerController.ImportStudents + selección manual de estudiantes
    // 
    // Flujo actual:
    // 1. Importar estudiantes masivamente: TechnicalCareerController.ImportStudents 
    // 2. Inscribir estudiantes en asignaturas: SubjectController.EnrollStudent (selección manual)
    // 3. Gestión individual: SubjectController.UnenrollStudent

    /// <summary>
    /// Obtiene los estudiantes disponibles para inscribir en una asignatura.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="year">Año del estudiante (opcional).</param>
    /// <returns>Lista de estudiantes disponibles para inscribir.</returns>
    [HttpGet("{subjectId}/available-students")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can view available students
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetAvailableStudents(
        Guid careerId, 
        Guid subjectId, 
        [FromQuery] CareerYear? year = null)
    {
        var query = new GetAvailableStudentsQuery
        {
            TechnicalCareerId = careerId,
            SubjectId = subjectId,
            Year = year
        };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Desenrola un estudiante de una asignatura.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="studentId">ID del estudiante a desenrolar.</param>
    /// <returns>True si se desenroló exitosamente.</returns>
    [HttpDelete("{subjectId}/students/{studentId}")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can unenroll students
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnenrollStudent(
        Guid careerId, 
        Guid subjectId, 
        string studentId)
    {
        var command = new UnenrollStudentCommand
        {
            SubjectId = subjectId,
            StudentId = studentId
        };
        var result = await mediator.Send(command);
        return result ? Ok(new { success = true }) : NotFound(new { success = false });
    }

    /// <summary>
    /// Desenrola múltiples estudiantes de una asignatura.
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica.</param>
    /// <param name="subjectId">ID de la asignatura.</param>
    /// <param name="request">Lista de IDs de estudiantes a desenrolar.</param>
    /// <returns>Resultado de la operación masiva.</returns>
    [HttpPost("{subjectId}/students/bulk-unenroll")]
    [Authorize(Roles = UserRoles.Admin)] // Only admin can bulk unenroll students
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> UnenrollStudents(
        Guid careerId, 
        Guid subjectId, 
        [FromBody] BulkUnenrollRequest request)
    {
        var command = new UnenrollStudentsCommand
        {
            SubjectId = subjectId,
            StudentIds = request.StudentIds
        };
        var result = await mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Revoca automáticamente todas las inscripciones expiradas del año anterior
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica (no usado pero necesario para la ruta)</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPost("revoke-expired-enrollments")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AcadEvalSys.Application.Students.Dtos.RevokeExpiredEnrollmentsResult>> RevokeExpiredEnrollments(Guid careerId)
    {
        try
        {
            logger.LogInformation("Admin initiated manual revocation of expired enrollments for career {CareerId}", careerId);
            
            var command = new RevokeExpiredEnrollmentsCommand
            {
                ExecutedBy = User.Identity?.Name ?? "Unknown"
            };
            
            var result = await mediator.Send(command);
            
            logger.LogInformation("Manual revocation completed. {RevokedCount} enrollments revoked", result.RevokedCount);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during manual enrollment revocation for career {CareerId}", careerId);
            return BadRequest(new { message = "Error al revocar inscripciones expiradas", error = ex.Message });
        }
    }

    /// <summary>
    /// Revoca inscripciones de un año académico específico
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica (no usado pero necesario para la ruta)</param>
    /// <param name="academicYear">Año académico a revocar</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPost("revoke-enrollments-by-year/{academicYear}")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AcadEvalSys.Application.Students.Dtos.RevokeExpiredEnrollmentsResult>> RevokeEnrollmentsByYear(Guid careerId, int academicYear)
    {
        try
        {
            logger.LogInformation("Admin initiated revocation of enrollments for academic year {AcademicYear} in career {CareerId}", academicYear, careerId);
            
            var command = new RevokeEnrollmentsByYearCommand
            {
                AcademicYear = academicYear,
                ExecutedBy = User.Identity?.Name ?? "Unknown"
            };
            
            var result = await mediator.Send(command);
            
            logger.LogInformation("Manual revocation by year completed. {RevokedCount} enrollments revoked for year {AcademicYear}", 
                result.RevokedCount, academicYear);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during manual enrollment revocation for year {AcademicYear} in career {CareerId}", academicYear, careerId);
            return BadRequest(new { message = $"Error al revocar inscripciones del año {academicYear}", error = ex.Message });
        }
    }

    /// <summary>
    /// Programa la ejecución inmediata del job de revocación automática
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica (no usado pero necesario para la ruta)</param>
    /// <returns>Confirmación de la programación</returns>
    [HttpPost("schedule-immediate-revocation")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult ScheduleImmediateRevocation(Guid careerId)
    {
        try
        {
            logger.LogInformation("Admin scheduled immediate enrollment revocation for career {CareerId}", careerId);
            
            // Programar ejecución inmediata usando Hangfire
            Hangfire.BackgroundJob.Enqueue(() => backgroundService.RevokeExpiredEnrollmentsAsync());
            
            return Ok(new { 
                message = "Job de revocación programado para ejecución inmediata",
                scheduledAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error scheduling immediate revocation for career {CareerId}", careerId);
            return BadRequest(new { message = "Error al programar la revocación inmediata", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene información sobre el año académico actual y el estado de las inscripciones
    /// </summary>
    /// <param name="careerId">ID de la carrera técnica (no usado pero necesario para la ruta)</param>
    /// <returns>Información del año académico</returns>
    [HttpGet("academic-year-info")]
    [Authorize(Roles = UserRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult GetAcademicYearInfo(Guid careerId)
    {
        var query = new GetAcademicYearInfoQuery();
        var result = mediator.Send(query).Result;
        
        return Ok(result);
    }
}

public class BulkUnenrollRequest
{
    public List<string> StudentIds { get; set; } = new();
}