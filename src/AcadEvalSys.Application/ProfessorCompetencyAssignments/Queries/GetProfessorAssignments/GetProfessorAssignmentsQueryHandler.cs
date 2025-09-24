using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Application.Extensions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Application.Users;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQueryHandler(
    IProfessorCompetencyAssignmentRepository professorCompetencyAssignmentRepository,
    IMapper mapper,
    ILogger<GetProfessorAssignmentsQueryHandler> logger,
    IUserContext userContext)
    : IRequestHandler<GetProfessorAssignmentsQuery, IEnumerable<ProfessorAssignmentWithStudentsDto>>
{
    public async Task<IEnumerable<ProfessorAssignmentWithStudentsDto>> Handle(GetProfessorAssignmentsQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        var professorId = currentUser?.Id ?? string.Empty;

        logger.LogInformation("Retrieving professor assignments for Professor ID: {ProfessorId}, Evaluation Instance: {EvaluationInstanceId}", 
            professorId, request.EvaluationInstanceId);

        var assignments = await professorCompetencyAssignmentRepository
            .GetProfessorAssignmentsAsync(professorId, request.EvaluationInstanceId);

        var assignmentsList = assignments.ToList();
        logger.LogInformation("Retrieved {Count} professor assignments", assignmentsList.Count);

        var result = assignmentsList.Select(assignment => {
            // Obtener las descripciones de los niveles de competencia
            var levelDescriptions = new Dictionary<Domain.Enums.CompetencyLevel, string>();
            if (assignment.Competency?.LevelDescriptions != null)
            {
                foreach (var levelDesc in assignment.Competency.LevelDescriptions)
                {
                    levelDescriptions[levelDesc.Level] = levelDesc.Description;
                }
            }

            return new ProfessorAssignmentWithStudentsDto
            {
                AssignmentId = assignment.Id,
                CompetencyName = assignment.Competency?.Name ?? string.Empty,
                CompetencyDescription = assignment.Competency?.Description ?? string.Empty,
                SubjectName = assignment.Subject?.Name ?? string.Empty,
                CareerName = assignment.Subject?.TechnicalCareer?.Name ?? string.Empty,
                CareerYear = assignment.Subject?.Year.ToOrdinalString() ?? string.Empty,
                Status = assignment.Status,
                TotalStudentsCount = assignment.TotalStudentsCount,
                EvaluatedStudentsCount = assignment.EvaluatedStudentsCount,
                ProgressPercentage = assignment.ProgressPercentage,
                PeriodFrom = assignment.CompetencyEvaluationInstance?.PeriodFrom,
                PeriodTo = assignment.CompetencyEvaluationInstance?.PeriodTo,
                StudentEvaluations = mapper.Map<IEnumerable<StudentCompetencyEvaluationDto>>(assignment.StudentCompetencyAssessments ?? new List<Domain.Entities.StudentCompetencyAssessment>()),
                CompetencyLevelDescriptions = levelDescriptions
            };
        });


        return result;
    }
}
