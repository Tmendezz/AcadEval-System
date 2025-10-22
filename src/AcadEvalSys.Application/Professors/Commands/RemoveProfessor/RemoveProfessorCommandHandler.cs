using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Commands.RemoveProfessor;

public class RemoveProfessorCommandHandler(
    ILogger<RemoveProfessorCommandHandler> logger,
    UserManager<User> userManager,
    IProfessorRepository professorRepository,
    ISubjectRepository subjectRepository
    ) : IRequestHandler<RemoveProfessorCommand, RemoveProfessorResult>
{
    public async Task<RemoveProfessorResult> Handle(RemoveProfessorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Removing professor with ID: {Id}", request.Id);

        var user = await userManager.FindByIdAsync(request.Id);
        if (user == null)
        {
            logger.LogWarning("User with ID {Id} not found", request.Id);
            return new RemoveProfessorResult
            {
                Success = false,
                Message = "Usuario no encontrado"
            };
        }

        var professor = await professorRepository.GetByIdAsync(request.Id);
        if (professor == null)
        {
            logger.LogWarning("Professor with user ID {Id} not found", request.Id);
            return new RemoveProfessorResult
            {
                Success = false,
                Message = "Profesor no encontrado"
            };
        }

        // Verificar asignaciones a asignaturas
        var assignedSubjects = await subjectRepository.GetByProfessorIdAsync(request.Id);

        if (assignedSubjects.Any())
        {
            logger.LogWarning("Professor {Id} has {Count} assigned subjects", request.Id, assignedSubjects.Count().ToString());
            return new RemoveProfessorResult
            {
                Success = false,
                HasAssignments = true,
                AssignedSubjects = assignedSubjects.Select(s => new SubjectAssignmentDto
                {
                    Id = s.Id,
                    Name = s.Name ?? string.Empty,
                    CareerName = s.TechnicalCareer?.Name ?? string.Empty,
                    Year = (int)s.Year
                }).ToList(),
                Message = $"El profesor está asignado a {assignedSubjects.Count().ToString()} asignatura(s). Debe desasignarlo primero."
            };
        }

        // Soft delete: marcar usuario como inactivo
        user.IsActive = false;
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            logger.LogError("Failed to deactivate user: {Errors}", string.Join(", ", updateResult.Errors.Select(e => e.Description)));
            return new RemoveProfessorResult
            {
                Success = false,
                Message = $"Error al desactivar usuario: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}"
            };
        }

        logger.LogInformation("Professor with ID: {Id} removed successfully (soft delete)", request.Id);
        return new RemoveProfessorResult
        {
            Success = true,
            HasAssignments = false,
            Message = "Profesor eliminado exitosamente"
        };
    }
}
