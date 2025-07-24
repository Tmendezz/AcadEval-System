
using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;
using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;
using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.EvaluateStudentCompetency;
using AcadEvalSys.Application.StudentCompetencyAssessments.Queries.GetAllStudentCompetencyAssessment;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AcadEvalSys.WEB.Server.Controllers
{
    [ApiController]
    [Route("professors")]
    public class ProfessorController(IMediator mediator) : ControllerBase
    {
        [HttpGet("{professorId}/assignments")]
        public async Task<IActionResult> GetProfessorAssignments(
            string professorId, 
            [FromQuery] Guid? evaluationInstanceId = null)
        {
            var query = new GetProfessorAssignmentsQuery(professorId, evaluationInstanceId);
            var result = await mediator.Send(query);
            return Ok(result);
        }

       
        [HttpGet("assignments/{assignmentId}/students")]
        public async Task<IActionResult> GetAssignmentStudents(Guid assignmentId)
        {
            var query = new GetAllStudentCompetencyAssessmentQuery(assignmentId);
            var result = await mediator.Send(query);
            return Ok(result);
        }

    
        [HttpPost("assignments/{assignmentId}/students/{studentId}/evaluate")]
        public async Task<IActionResult> EvaluateStudentCompetency(
            Guid assignmentId, 
            string studentId, 
            [FromBody] EvaluateStudentCompetencyCommand request)
        {
            var command = new CompleteStudentAssessmentCommand
            {
                ProfessorCompetencyAssignmentId = assignmentId,
                StudentId = studentId,
                CompetencyLevel = request.CompetencyLevel
            };

            var result = await mediator.Send(command);
            return Ok(new { AssessmentId = result });
        }
    }
}
