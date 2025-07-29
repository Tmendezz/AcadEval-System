using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Commands.UpdateEvaluationInfoInstance;

public class UpdateEvaluationInstanceCommandHandler(
    ILogger<UpdateEvaluationInstanceCommandHandler> logger,
    IMapper mapper,
    ICompetencyEvaluationInstanceRepository repository,
    IUserContext userContext
    ) : IRequestHandler<UpdateEvaluationInstanceCommand>
{
    public async Task Handle(UpdateEvaluationInstanceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating CompetencyEvaluationInstance with ID: {Id}", request.Id);

        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedAccessException("User must be authenticated to perform this action");
        }

        var instance = await repository.GetByIdAsync(request.Id);
        if (instance == null)
        {
            throw new NotFoundException(nameof(instance), request.Id.ToString());
        }

        instance.Title = request.Title;
        instance.Description = request.Description;
        instance.PeriodFrom = request.PeriodFrom;
        instance.PeriodTo = request.PeriodTo;
        instance.UpdatedAt = DateTime.UtcNow;
        instance.UpdatedByUserId = user.Id;

        await repository.UpdateAsync(instance);

        logger.LogInformation("CompetencyEvaluationInstance with ID: {Id} updated successfully", request.Id);
    }
}