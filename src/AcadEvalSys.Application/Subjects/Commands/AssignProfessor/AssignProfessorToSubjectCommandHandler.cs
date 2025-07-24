using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.AssignProfessor;

public class AssignProfessorToSubjectCommandHandler(
    ILogger<AssignProfessorToSubjectCommandHandler> logger,
    ISubjectRepository subjectRepository,
    IProfessorRepository professorRepository
    ) : IRequestHandler<AssignProfessorToSubjectCommand, bool>
{
    public async Task<bool> Handle(AssignProfessorToSubjectCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Assign professor {ProfessorId} to subject {SubjectId}", request.ProfessorId, request.SubjectId);

        // validar que existe la materia
        var subject = await subjectRepository.GetSubjectByIdAsync(request.SubjectId);
        if (subject == null)
        {
            logger.LogWarning("Subject with ID {SubjectId} not found", request.SubjectId);
            throw new NotFoundException(nameof(Subject), request.SubjectId.ToString());
        }

        // validar que el profesor existe y está activo
        var professor = await professorRepository.GetProfessorByIdAsync(request.ProfessorId);
        if (professor == null)
        {
            logger.LogWarning("Professor with ID {ProfessorId} not found or not active", request.ProfessorId);
            throw new NotFoundException(nameof(Professor), request.ProfessorId);
        }

        // validar si la materia ya tiene el mismo profesor asignado
        if (subject.ProfessorId == request.ProfessorId)
        {
            logger.LogInformation("Professor {ProfessorId} is already assigned to subject {SubjectId}", request.ProfessorId, request.SubjectId);
            return true; // No es necesario hacer nada, ya está asignado
        }

        // si la materia ya tiene un profesor diferente, registrar la reasignación
        if (!string.IsNullOrEmpty(subject.ProfessorId))
        {
            logger.LogInformation("Reassigning subject {SubjectId} from professor {OldProfessorId} to professor {NewProfessorId}",
                request.SubjectId, subject.ProfessorId, request.ProfessorId);
        }

        try
        {
            await subjectRepository.AssignProfessorToSubjectAsync(request.SubjectId, request.ProfessorId);
            logger.LogInformation("Professor {ProfessorId} assigned to subject {SubjectId} successfully", request.ProfessorId, request.SubjectId);
            return true;
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Error assigning professor {ProfessorId} to subject {SubjectId}", request.ProfessorId, request.SubjectId);
            return false;
        }
    }
}