using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignmentById;
using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;
using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;
using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetAllStudentCompetencyAssessment;
using AcadEvalSys.Domain.Constants.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("professor-assignments")]
// Admin, Coordinator y Professor pueden acceder; la lógica de filtrado por profesor
// se resuelve en el handler a partir del usuario autenticado si no se provee professorId
[Authorize(Roles = $"{UserRoles.Admin},{UserRoles.Coordinator},{UserRoles.Professor}")]
public class ProfessorAssignmentsController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Lista asignaciones de profesor. Se puede filtrar por professorId y evaluationInstanceId.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProfessorAssignments(
        [FromQuery] Guid? evaluationInstanceId = null)
    {
        var query = new GetProfessorAssignmentsQuery(evaluationInstanceId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene una asignación específica de profesor por su ID.
    /// </summary>
    [HttpGet("{assignmentId}")]
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
    [HttpGet("{assignmentId}/students")]
    public async Task<IActionResult> GetAssignmentStudents(Guid assignmentId)
    {
        var query = new GetAllStudentCompetencyAssessmentQuery(assignmentId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Crea una evaluación de competencia para un estudiante dentro de una asignación.
    /// </summary>
    [HttpPost("{assignmentId}/students/{studentId}/assessments")]
    public async Task<IActionResult> CreateStudentAssessment(
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


