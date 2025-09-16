using AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyWithResponse;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetUserSurveys;
using AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsForUser;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace AcadEvalSys.WEB.Server.Controllers;

/// <summary>
/// Controlador para la gestión de encuestas desde la perspectiva del usuario (estudiante/profesor).
/// </summary>
[ApiController]
[Route("my-surveys")]
[Authorize(Roles = $"{UserRoles.Student},{UserRoles.Professor}")]
public class UserSurveysController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Obtiene las encuestas del usuario autenticado, con filtrado opcional por estado.
    /// </summary>
    /// <param name="status">Estado de las encuestas: "pending", "completed", o null para todas</param>
    /// <returns>Lista de encuestas del usuario con información de estado y respuesta</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Produces("application/json")]
    public async Task<IActionResult> GetMySurveys([FromQuery] string? status = null)
    {
        try
        {
            Log.Information("Obteniendo encuestas del usuario con filtro: {Status}", status ?? "all");
            
            var query = new GetUserSurveysQuery { Status = status };
            var result = await mediator.Send(query);
            
            Log.Information("Se encontraron {Count} encuestas para el usuario", 
                result?.Count() ?? 0);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al obtener encuestas del usuario con filtro: {Status}", status ?? "all");
            throw;
        }
    }

    /// <summary>
    /// Obtiene todos los surveySubjects de una encuesta específica para el usuario autenticado.
    /// </summary>
    /// <param name="surveyId">ID de la encuesta</param>
    /// <returns>Lista de surveySubjects con información de la materia y progreso</returns>
    [HttpGet("{surveyId}/subjects")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/json")]
    public async Task<IActionResult> GetSurveySubjectsForUser([FromRoute] Guid surveyId)
    {
        try
        {
            Log.Information("Obteniendo survey subjects de la encuesta {SurveyId} para el usuario", surveyId);
            
            var query = new GetSurveySubjectsForUserQuery { SurveyId = surveyId };
            var result = await mediator.Send(query);
            
            Log.Information("Se encontraron {Count} survey subjects para la encuesta {SurveyId}", 
                result?.Count() ?? 0, surveyId);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al obtener survey subjects de la encuesta {SurveyId}", surveyId);
            throw;
        }
    }

    /// <summary>
    /// Obtiene una encuesta específica con sus preguntas y respuestas existentes (si las hay).
    /// </summary>
    /// <param name="surveySubjectId">ID de la relación encuesta-asignatura</param>
    /// <param name="readOnly">Si es true, la encuesta se muestra en modo solo lectura</param>
    /// <returns>Encuesta con preguntas y respuestas del usuario</returns>
    [HttpGet("subjects/{surveySubjectId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Produces("application/json")]
    public async Task<IActionResult> GetSurveyForResponse(
        [FromRoute] Guid surveySubjectId, 
        [FromQuery] bool readOnly = false)
    {
        try
        {
            Log.Information("Obteniendo encuesta para respuesta: {SurveySubjectId}, ReadOnly: {ReadOnly}", 
                surveySubjectId, readOnly);
            
            var query = new GetSurveyWithResponseQuery 
            { 
                SurveySubjectId = surveySubjectId,
                ReadOnly = readOnly 
            };
            
            var result = await mediator.Send(query);
            
            if (result == null)
            {
                Log.Warning("Encuesta no encontrada o sin acceso: {SurveySubjectId}", surveySubjectId);
                return NotFound("Encuesta no encontrada o sin acceso");
            }
            
            Log.Information("Encuesta obtenida exitosamente: {SurveyId}, Título: {Title}", 
                result.Id, result.Title);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al obtener encuesta para respuesta: {SurveySubjectId}", surveySubjectId);
            throw;
        }
    }

    /// <summary>
    /// Envía las respuestas del usuario para una encuesta específica.
    /// </summary>
    /// <param name="surveySubjectId">ID de la relación encuesta-asignatura</param>
    /// <param name="command">Comando con las respuestas de la encuesta</param>
    /// <returns>ID de la respuesta creada</returns>
    [HttpPost("subjects/{surveySubjectId}/responses")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [Produces("application/json")]
    public async Task<IActionResult> SubmitResponse(
        [FromRoute] Guid surveySubjectId, 
        [FromBody] SubmitSurveyResponseCommand command)
    { 
        try
        {
            Log.Information("Enviando respuesta de encuesta: {SurveySubjectId}, Respuestas: {Count}", 
                surveySubjectId, command.Answers?.Count ?? 0);
            
            command.AcademicSurveySubjectId = surveySubjectId;
            var id = await mediator.Send(command);
            
            Log.Information("Respuesta de encuesta enviada exitosamente: {ResponseId}", id);
            return Ok(new { id }); 
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("ya ha sido respondida"))
        {
            Log.Warning("Intento de responder encuesta ya completada: {SurveySubjectId}, Error: {Message}", 
                surveySubjectId, ex.Message);
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al enviar respuesta de encuesta: {SurveySubjectId}", surveySubjectId);
            throw;
        }
    }
}
