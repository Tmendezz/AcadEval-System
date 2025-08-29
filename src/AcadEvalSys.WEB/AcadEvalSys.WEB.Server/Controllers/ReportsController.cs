using AcadEvalSys.Application.Reports.Commands.DeleteReport;
using AcadEvalSys.Application.Reports.Commands.UpdateReportObservation;
using AcadEvalSys.Application.Reports.Queries.GetEvaluationInstanceReports;
using AcadEvalSys.Application.Reports.Queries.GetReportDownloadUrl;
using AcadEvalSys.Application.Reports.Queries.GetStudentReports;
using AcadEvalSys.Application.Reports.Queries.DownloadReportFile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de reportes de evaluación.
/// </summary>
[ApiController]
[Route("evaluation-reports")]
[Authorize]
public class ReportsController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene URL temporal para descargar un reporte específico
    /// </summary>
    /// <param name="reportId">El ID del reporte a descargar.</param>
    /// <returns>La URL temporal para descargar el reporte.</returns>
    [HttpGet("{reportId}/download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetReportDownloadUrl(Guid reportId)
    {
        var query = new GetReportDownloadUrlQuery(reportId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Descarga directa del archivo del reporte con autorización (estudiante)
    /// </summary>
    [HttpGet("{reportId}/file")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadReportFile(Guid reportId)
    {
        var result = await mediator.Send(new DownloadReportFileQuery(reportId));
        return File(result.Content, result.ContentType, result.FileName);
    }

    /// <summary>
    /// Obtiene todos los reportes de un estudiante
    /// </summary>
    /// <param name="studentId">El ID del estudiante para el cual se buscan los reportes.</param>
    /// <returns>Los reportes del estudiante.</returns>
    [HttpGet("student/{studentId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetStudentReports(string studentId)
    {
        var query = new GetStudentReportsQuery { StudentId = studentId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene todos los reportes de una instancia de evaluación
    /// </summary>
    /// <param name="evaluationInstanceId">El ID de la instancia de evaluación para la cual se buscan los reportes.</param>
    /// <returns>Los reportes de la instancia de evaluación.</returns>
    [HttpGet("evaluation-instance/{evaluationInstanceId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetEvaluationInstanceReports(Guid evaluationInstanceId)
    {
        var query = new GetEvaluationInstanceReportsQuery { EvaluationInstanceId = evaluationInstanceId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Actualiza la observación de un reporte (solo coordinadores/admins)
    /// </summary>
    /// <param name="reportId">El ID del reporte a actualizar.</param>
    /// <param name="request">Los datos de la observación a actualizar.</param>
    /// <returns>Un mensaje de éxito.</returns>
    [HttpPut("{reportId}/observation")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateReportObservation(Guid reportId, [FromBody] UpdateObservationRequest request)
    {
        var command = new UpdateReportObservationCommand
        {
            ReportId = reportId,
            Observation = request.Observation
        };

        await mediator.Send(command);
        return Ok(new { Message = "Observation updated successfully" });
    }

    /// <summary>
    /// Elimina un reporte y su archivo asociado
    /// </summary>
    /// <param name="reportId">El ID del reporte a eliminar.</param>
    /// <returns>Un mensaje de éxito.</returns>
    [HttpDelete("{reportId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteReport(Guid reportId)
    {
        var command = new DeleteReportCommand { ReportId = reportId };
        await mediator.Send(command);
        return Ok(new { Message = "Report deleted successfully" });
    }
}

// DTOs para las requests
public class UpdateObservationRequest
{
    public string? Observation { get; set; }
}
