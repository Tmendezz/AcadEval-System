using AcadEvalSys.Application.Reports.Commands.DeleteReport;
using AcadEvalSys.Application.Reports.Commands.UpdateReportObservation;
using AcadEvalSys.Application.Reports.Queries.GetEvaluationInstanceReports;
using AcadEvalSys.Application.Reports.Queries.GetReportDownloadUrl;
using AcadEvalSys.Application.Reports.Queries.GetStudentReports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("evaluation-reports")]
[Authorize]
public class ReportsController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene URL temporal para descargar un reporte específico
    /// </summary>
    [HttpGet("{reportId}/download")]
    public async Task<IActionResult> GetReportDownloadUrl(Guid reportId)
    {
        var query = new GetReportDownloadUrlQuery { ReportId = reportId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene todos los reportes de un estudiante
    /// </summary>
    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentReports(string studentId)
    {
        var query = new GetStudentReportsQuery { StudentId = studentId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene todos los reportes de una instancia de evaluación
    /// </summary>
    [HttpGet("evaluation-instance/{evaluationInstanceId}")]
    public async Task<IActionResult> GetEvaluationInstanceReports(Guid evaluationInstanceId)
    {
        var query = new GetEvaluationInstanceReportsQuery { EvaluationInstanceId = evaluationInstanceId };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Actualiza la observación de un reporte (solo coordinadores/admins)
    /// </summary>
    [HttpPut("{reportId}/observation")]
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
    [HttpDelete("{reportId}")]
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
