using AcadEvalSys.Application.ProfessorCompetencyAssignments.Dtos;
using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Application.Extensions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignmentById;

public class GetProfessorAssignmentByIdQueryHandler(
    IProfessorCompetencyAssignmentRepository professorCompetencyAssignmentRepository,
    IMapper mapper,
    ILogger<GetProfessorAssignmentByIdQueryHandler> logger)
    : IRequestHandler<GetProfessorAssignmentByIdQuery, ProfessorAssignmentWithStudentsDto?>
{
    public async Task<ProfessorAssignmentWithStudentsDto?> Handle(GetProfessorAssignmentByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving professor assignment by ID: {AssignmentId}", request.AssignmentId);

        var assignment = await professorCompetencyAssignmentRepository.GetByIdAsync(request.AssignmentId);

        if (assignment == null)
        {
            logger.LogWarning("Professor assignment not found with ID: {AssignmentId}", request.AssignmentId);
            return null;
        }

        // Obtener las descripciones de los niveles de competencia
        var levelDescriptions = new Dictionary<Domain.Enums.CompetencyLevel, string>();
        if (assignment.Competency?.LevelDescriptions != null)
        {
            foreach (var levelDesc in assignment.Competency.LevelDescriptions)
            {
                levelDescriptions[levelDesc.Level] = levelDesc.Description;
            }
        }

        var result = new ProfessorAssignmentWithStudentsDto
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

        logger.LogInformation("Retrieved professor assignment: {AssignmentId}, Status: {Status}, Students: {StudentCount}",
            result.AssignmentId, result.Status, result.TotalStudentsCount);

        return result;
    }
}