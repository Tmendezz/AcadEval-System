using AcadEvalSys.Application.Subjects.Commands.AssignProfessor;
using AcadEvalSys.Application.Subjects.Commands.CreateSubject;
using AcadEvalSys.Application.Subjects.Commands.DeleteSubject;
using AcadEvalSys.Application.Subjects.Commands.EnrollStudent;
using AcadEvalSys.Application.Subjects.Commands.UpdateSubject;
using AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;
using AcadEvalSys.Application.Subjects.Queries.GetSubjectById;
using AcadEvalSys.Domain.Constants.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers;

[ApiController]
[Route("subjects")]
[Authorize(Roles = UserRoles.Admin)]
public class SubjectController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectCommand command)
    {
        var subjectId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetSubjectById), new { id = subjectId }, new { id = subjectId });
    }


    [HttpGet]
    public async Task<IActionResult> GetAllSubjects()
    {
        var query = new GetAllSubjectsQuery();
        var subjects = await mediator.Send(query);
        return Ok(subjects);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetSubjectById(Guid id)
    {
        var query = new GetSubjectByIdQuery { Id = id };
        var subject = await mediator.Send(query);
        return Ok(subject);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubject(Guid id, [FromBody] UpdateSubjectCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSubject(Guid id)
    {
        var command = new DeleteSubjectCommand(id);
        await mediator.Send(command);
        return NoContent();
    }


    [HttpPost("{id}/enroll-student")]
    public async Task<IActionResult> EnrollStudent(Guid id, [FromBody] EnrollStudentInSubjectCommand command)
    {
        command.SubjectId = id;
        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest();
    }


    [HttpPut("{id}/assign-professor")]
    public async Task<IActionResult> AssignProfessor(Guid id, [FromBody] AssignProfessorToSubjectCommand command)
    {
        command.SubjectId = id;
        var result = await mediator.Send(command);
        return result ? Ok() : BadRequest();
    }
}