using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.UpdateSubject;

public class UpdateSubjectCommandHandler(
    ILogger<UpdateSubjectCommandHandler> logger, 
    IMapper mapper, 
    IUserContext userContext, 
    ISubjectRepository subjectRepository)  : IRequestHandler<UpdateSubjectCommand>
{
    public async Task Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
    {
       logger.LogInformation("Updating subject with {@Request}", request);

        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            logger.LogError("User context is null despite controller authorization - possible system configuration error");
            throw new InvalidOperationException("User context not found");
        }
        
        var existingSubject = await subjectRepository.GetSubjectByIdAsync(request.Id);
        
        if (existingSubject == null)
        {
            logger.LogWarning("Subject with ID: {Id} not found", request.Id);
            throw new NotFoundException(nameof(Subject), request.Id.ToString());
        }

        mapper.Map(request, existingSubject);
        
        existingSubject.UpdatedByUserId = user.Id;
        existingSubject.UpdatedAt = DateTime.UtcNow;
        
        await subjectRepository.UpdateSubjectAsync(existingSubject);
    }
}