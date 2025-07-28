using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Competencies.Commands.CreateCompetency;

public class CreateCompetencyCommandHandler(ILogger<CreateCompetencyCommandHandler> logger, ICompetencyRepository competencyRepository, IMapper mapper, IUserContext userContext) : IRequestHandler<CreateCompetencyCommand, Guid>
{
    public async Task<Guid> Handle(CreateCompetencyCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating competency {@Competency}", request);

        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            logger.LogError("User context is null despite controller authorization - possible system configuration error");
            throw new InvalidOperationException("User context not found");
        }

        var existingCompetency = await competencyRepository.ExistsByNameAsync(request.Name);

        if (existingCompetency)
        {
            logger.LogWarning("Competency with name '{Name}' already exists", request.Name);
            throw new DuplicateResourceException(nameof(Competency), request.Name);
        }


        var competency = mapper.Map<Competency>(request);
        competency.CreatedByUserId = user.Id ?? String.Empty;

        if (request.CompetencyLevelDescriptions != null && request.CompetencyLevelDescriptions.Count > 0)
        {
            competency.LevelDescriptions = request.CompetencyLevelDescriptions
                .Select(kvp => new CompetencyLevelDescription
                {
                    Level = kvp.Key,
                    Description = kvp.Value
                })
                .ToList();
        }

        var id = await competencyRepository.CreateAsync(competency);

        logger.LogInformation("Competency created successfully with ID: {Id}", id);

        return id;
    }
}