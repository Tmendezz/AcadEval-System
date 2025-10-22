using AcadEvalSys.Application.Evaluations.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Commands.CreateInstance;

public class CreateEvaluationInstanceCommandHandler(
    ILogger<CreateEvaluationInstanceCommandHandler> logger,
    ICompetencyEvaluationInstanceRepository competencyEvaluationInstanceRepository,
    IProfessorCompetencyAssignmentRepository professorCompetencyAssignmentRepository,
    ICompetencyRepository competencyRepository,
    ISubjectRepository subjectRepository,
    IMapper mapper,
    IUserContext userContext) : IRequestHandler<CreateEvaluationInstanceCommand, Guid>
{
    public async Task<Guid> Handle(CreateEvaluationInstanceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating CompetencyEvaluationInstance with title: {Title}", request.Title);

        await ValidateAssignmentsAsync(request.CompetencyAssignments);
        var user = userContext.GetCurrentUser();

        if (user == null)
        {
            throw new UnauthorizedAccessException("Current user context is not available. User must be authenticated to create evaluation instances.");
        }

        var competencyEvaluationInstance = mapper.Map<CompetencyEvaluationInstance>(request);
        competencyEvaluationInstance.Status = EvaluationStatus.Pending;
        competencyEvaluationInstance.CreatedAt = DateTime.UtcNow;
        competencyEvaluationInstance.CreatedByUserId = user.Id;

        var competencyEvaluationInstanceId = await competencyEvaluationInstanceRepository.CreateAsync(competencyEvaluationInstance);

        logger.LogInformation("CompetencyEvaluationInstance created with ID: {Id}", competencyEvaluationInstanceId);

        // Crear las asignaciones de competencias a profesores
        // ORDENAR POR AÑO DESCENDENTE para crear primero las del año superior
        var professorAssignments = new List<(ProfessorCompetencyAssignment Assignment, Subject Subject)>();

        foreach (var assignment in request.CompetencyAssignments)
        {
            // Obtener la información del Subject para establecer los campos faltantes
            var subject = await subjectRepository.GetSubjectByIdAsync(assignment.SubjectId);
            if (subject == null)
            {
                throw new NotFoundException(nameof(Subject), assignment.SubjectId.ToString());
            }

            var professorAssignment = mapper.Map<ProfessorCompetencyAssignment>(assignment);
            professorAssignment.CompetencyEvaluationInstanceId = competencyEvaluationInstanceId;
            
            professorAssignments.Add((professorAssignment, subject));
        }

        if (professorAssignments.Any())
        {
            // IMPORTANTE: Ordenar por año DESCENDENTE (3º, 2º, 1º)
            // Así los assessments del año superior se crean primero
            var orderedAssignments = professorAssignments
                .OrderByDescending(x => (int)x.Subject.Year)
                .ToList();

            foreach (var (assignment, subject) in orderedAssignments)
            {
                assignment.CreatedAt = DateTime.UtcNow;
                assignment.CreatedByUserId = user.Id;
                // El repositorio ahora verificará si ya existe un assessment para cada estudiante/competencia
                await professorCompetencyAssignmentRepository.CreateAsync(assignment);
            }
            
            logger.LogInformation("Created {Count} professor competency assignments with automatic student assessments (ordered by year)", professorAssignments.Count);
        }

        return competencyEvaluationInstanceId;
    }

    private async Task ValidateAssignmentsAsync(CreateCompetencyAssignmentDto[] assignments)
    {
        var competencyIds = assignments.Select(a => a.CompetencyId).Distinct().ToList();
        var subjectIds = assignments.Select(a => a.SubjectId).Distinct().ToList();

        // Validar competencias
        foreach (var competencyId in competencyIds)
        {
            var competencyExists = await competencyRepository.ExistsAsync(competencyId);
            if (!competencyExists)
            {
                throw new NotFoundException(nameof(Competency), competencyId.ToString());
            }
        }

        // Validar materias
        foreach (var subjectId in subjectIds)
        {
            var subjectExists = await subjectRepository.ExistsByIdAsync(subjectId);
            if (!subjectExists)
            {
                throw new NotFoundException(nameof(Subject), subjectId.ToString());
            }
        }
    }

}