using AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse;
using AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetAssignedSurveys;
using AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveyDetail;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveySubjectsForUser;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("survey-responses")]
[Authorize(Roles = $"{UserRoles.Student},{UserRoles.Professor}")]
public class SurveyResponsesController(IMediator mediator) : ControllerBase
{
    // Listado de encuestas asignadas
    [HttpGet]
    public async Task<IActionResult> GetAssignedSurveys([FromQuery] string? status = null, [FromQuery] bool? completed = null)
    {
        var query = new GetAssignedSurveysQuery(status) { Completed = completed };
        var result = await mediator.Send(query);
        return Ok(result);
    }

    // Obtener detalle de una encuesta para responder o revisar
    [HttpGet("{surveyId}")]
    public async Task<IActionResult> GetSurveyDetail(Guid surveyId, [FromQuery] bool readOnly = false)
    {
        var query = new GetSurveyDetailQuery(surveyId, readOnly);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    // Obtener subjects (asignaturas/profesores) de una encuesta para el usuario actual
    [HttpGet("{surveyId}/subjects")]
    public async Task<IActionResult> GetSurveySubjectsForUser(Guid surveyId)
    {
        var query = new GetSurveySubjectsForUserQuery(surveyId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    // Enviar respuestas de la encuesta
    [HttpPost("{surveyId}")]
    public async Task<IActionResult> SubmitResponse(Guid surveyId, SubmitSurveyResponseCommand command)
    {
        command.SurveyId = surveyId;
        var responseId = await mediator.Send(command);
        return Ok(new { id = responseId });
    }
}
