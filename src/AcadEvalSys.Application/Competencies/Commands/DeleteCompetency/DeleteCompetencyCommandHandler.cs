using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Competencies.Commands.DeleteCompetency;

public class DeleteCompetencyCommandHandler(ILogger<DeleteCompetencyCommandHandler> logger, ICompetencyRepository competencyRepository, IUserContext userContext) : IRequestHandler<DeleteCompetencyCommand>
{
    public async Task Handle(DeleteCompetencyCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting competency with ID: {Id}", request.Id);
        
        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            logger.LogError("User context is null despite controller authorization - possible system configuration error");
            throw new InvalidOperationException("User context not found");
        }

        await competencyRepository.DeleteAsync(request.Id, user.Id);
        
        logger.LogInformation("Competency with ID: {Id} deleted successfully", request.Id);
    }
}