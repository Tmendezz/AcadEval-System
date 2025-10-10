using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluations;
using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentEvaluationInstances;
using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetStudentReceivedEvaluations;
using AcadEvalSys.Application.Reports.Queries.DownloadReportFile;
using AcadEvalSys.Application.Reports.Queries.GetReportDownloadUrl;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para que los estudiantes puedan ver sus evaluaciones de competencia y descargar reportes.
/// Solo accesible por estudiantes autenticados.
/// </summary>
[ApiController]
[Route("student-evaluations")]
[Authorize(Roles = UserRoles.Student)]
public class StudentEvaluationsController(IMediator mediator, IUserContext userContext) : ControllerBase
{
    /// <summary>
    /// Obtiene las instancias de evaluación disponibles para el estudiante autenticado.
    /// </summary>
    /// <returns>Lista de instancias de evaluación del estudiante.</returns>
    [HttpGet("evaluation-instances")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Produces("application/json")]
    public async Task<IActionResult> GetMyEvaluationInstances()
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new GetStudentEvaluationInstancesQuery(currentUser.Id!);
        var instances = await mediator.Send(query);
        
        return Ok(instances);
    }

    /// <summary>
    /// Obtiene las evaluaciones de competencia del estudiante para una instancia específica.
    /// </summary>
    /// <param name="evaluationInstanceId">ID de la instancia de evaluación.</param>
    /// <returns>Lista de evaluaciones de competencia del estudiante.</returns>
    [HttpGet("evaluation-instances/{evaluationInstanceId}/evaluations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetMyEvaluations(Guid evaluationInstanceId)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new GetStudentEvaluationsQuery(currentUser.Id!, evaluationInstanceId);
        var evaluations = await mediator.Send(query);
        
        if (!evaluations.Any())
        {
            return NotFound("No se encontraron evaluaciones para esta instancia.");
        }
        
        return Ok(evaluations);
    }

    /// <summary>
    /// Obtiene todas las evaluaciones de competencia del estudiante autenticado.
    /// </summary>
    /// <returns>Lista de todas las evaluaciones del estudiante.</returns>
    [HttpGet("evaluations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllMyEvaluations()
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new GetStudentEvaluationsQuery(currentUser.Id!);
        var evaluations = await mediator.Send(query);
        
        return Ok(evaluations);
    }

    /// <summary>
    /// Obtiene las evaluaciones recibidas por el estudiante autenticado con información completa.
    /// </summary>
    /// <returns>Lista de evaluaciones recibidas con detalles completos.</returns>
    [HttpGet("received-evaluations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Produces("application/json")]
    public async Task<IActionResult> GetMyReceivedEvaluations()
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new GetStudentReceivedEvaluationsQuery(currentUser.Id!);
        var receivedEvaluations = await mediator.Send(query);
        
        return Ok(receivedEvaluations);
    }

    /// <summary>
    /// Genera una URL temporal para descargar un reporte de evaluación.
    /// </summary>
    /// <param name="reportId">ID del reporte a descargar.</param>
    /// <returns>URL temporal para descargar el reporte.</returns>
    [HttpGet("reports/{reportId}/download-url")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetReportDownloadUrl(Guid reportId)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new GetReportDownloadUrlQuery(reportId);
        var result = await mediator.Send(query);
        
        return Ok(result);
    }

    /// <summary>
    /// Descarga directamente un reporte de evaluación como archivo PDF.
    /// </summary>
    /// <param name="reportId">ID del reporte a descargar.</param>
    /// <returns>Archivo PDF del reporte.</returns>
    [HttpGet("reports/{reportId}/download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/pdf")]
    public async Task<IActionResult> DownloadReport(Guid reportId)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var query = new DownloadReportFileQuery(reportId);
        var result = await mediator.Send(query);
        
        return File(result.Content, "application/pdf", result.FileName);
    }
}
