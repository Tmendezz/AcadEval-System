using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.DeleteSubject;

public class DeleteSubjectCommandHandler(ILogger<DeleteSubjectCommandHandler> logger, IUserContext userContext, ISubjectRepository subjectRepository) : IRequestHandler<DeleteSubjectCommand>
{
    public async Task Handle(DeleteSubjectCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting subject with ID: {Id} from career {CareerId}", request.Id, request.TechnicalCareerId);

        var user = userContext.GetCurrentUser();

        if (user == null)
        {
            logger.LogError("User context is null despite controller authorization - possible system configuration error");
            throw new InvalidOperationException("User context not found");
        }

        var subject = await subjectRepository.GetSubjectByIdAsync(request.Id);

        if (subject == null)
        {
            logger.LogWarning("Subject with ID: {Id} not found", request.Id);
            throw new NotFoundException(nameof(Subject), request.Id.ToString());
        }

        // Validar que la materia pertenece a la carrera técnica especificada
        if (subject.TechnicalCareerId != request.TechnicalCareerId)
        {
            logger.LogWarning("Subject with ID: {Id} does not belong to career {CareerId}", request.Id, request.TechnicalCareerId);
            throw new NotFoundException(nameof(Subject), request.Id.ToString());
        }

        subject.IsActive = false;
        subject.UpdatedAt = DateTime.UtcNow;
        subject.UpdatedByUserId = user.Id;

        await subjectRepository.DeleteAsync(subject);

        logger.LogInformation("Subject with ID: {Id} deleted successfully from career {CareerId}", request.Id, request.TechnicalCareerId);
    }
}