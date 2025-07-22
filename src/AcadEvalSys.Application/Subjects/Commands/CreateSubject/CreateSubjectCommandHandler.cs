using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.CreateSubject;

public class CreateSubjectCommandHandler(ILogger<CreateSubjectCommandHandler> logger, IMapper mapper, IUserContext userContext, ISubjectRepository subjectRepository) : IRequestHandler<CreateSubjectCommand, Guid>
{
    public async Task<Guid> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating subject with {@Request}", request);
        
        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            logger.LogError("User context is null despite controller authorization - possible system configuration error");
            throw new InvalidOperationException("User context not found");
        }
        
        var existingSubject = await subjectRepository.ExistsByNameAndCareerAsync(request.Name, request.TechnicalCareerId);
        
        if (existingSubject) 
        {
            logger.LogWarning("Subject with name '{Name}' already exists in career {CareerId}", request.Name, request.TechnicalCareerId);
            throw new DuplicateResourceException(nameof(Subject), request.Name);
        }
        
        var subject = mapper.Map<Subject>(request);
        subject.CreatedByUserId = user.Id;
        
        var id = await subjectRepository.CreateSubjectAsync(subject);
        
        logger.LogInformation("Subject created successfully with ID: {Id}", id);
        
        return id;
    }
}