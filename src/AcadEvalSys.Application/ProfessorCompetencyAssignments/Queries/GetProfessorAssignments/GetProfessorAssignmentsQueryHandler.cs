using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQueryHandler(
    IProfessorCompetencyAssignmentRepository professorCompetencyAssignmentRepository,
    IMapper mapper,
    ILogger<GetProfessorAssignmentsQueryHandler> logger)
    : IRequestHandler<GetProfessorAssignmentsQuery, IEnumerable<ProfessorAssignmentWithStudentsDto>>
{
    public async Task<IEnumerable<ProfessorAssignmentWithStudentsDto>> Handle(GetProfessorAssignmentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving professor assignments for Professor ID: {ProfessorId}, Evaluation Instance: {EvaluationInstanceId}", 
            request.ProfessorId, request.EvaluationInstanceId);

        var assignments = await professorCompetencyAssignmentRepository
            .GetProfessorAssignmentsAsync(request.ProfessorId, request.EvaluationInstanceId);

        var assignmentsList = assignments.ToList();
        logger.LogInformation("Retrieved {Count} professor assignments", assignmentsList.Count);

        var result = assignmentsList.Select(assignment => new ProfessorAssignmentWithStudentsDto
        {
            AssignmentId = assignment.Id,
            CompetencyName = assignment.Competency?.Name ?? string.Empty,
            CompetencyDescription = assignment.Competency?.Description ?? string.Empty,
            SubjectName = assignment.Subject?.Name ?? string.Empty,
            Status = assignment.Status,
            TotalStudentsCount = assignment.TotalStudentsCount,
            EvaluatedStudentsCount = assignment.EvaluatedStudentsCount,
            ProgressPercentage = assignment.ProgressPercentage,
            StudentEvaluations = mapper.Map<IEnumerable<StudentCompetencyEvaluationDto>>(assignment.StudentCompetencyAssessments ?? new List<Domain.Entities.StudentCompetencyAssessment>())
        });

        return result;
    }
}
