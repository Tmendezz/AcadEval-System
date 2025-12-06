using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Templates.Commands.DeleteTemplate
{
    public class DeleteTemplateCommandHandler(ILogger<DeleteTemplateCommandHandler> logger, 
        ISurveyTemplateRepository surveyTemplateRepository, IUserContext userContext) : IRequestHandler<DeleteSurveyTemplateCommand>
    {
        public async Task Handle(DeleteSurveyTemplateCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Soft-deleting SurveyTemplate Id: {Id}", request.Id);

            var user = userContext.GetCurrentUser();
            if (user == null)
            {
                throw new UnauthorizedAccessException("Current user context is not available. User must be authenticated to delete survey templates.");
            }

            // Validate existence before deletion
            var existing = await surveyTemplateRepository.GetTemplateByIdAsync(request.Id, includeChildren: false, cancellationToken);
            if (existing is null)
            {
                logger.LogWarning("SurveyTemplate Id: {Id} not found or already inactive.", request.Id);
                throw new KeyNotFoundException($"SurveyTemplate with ID {request.Id} not found or already inactive.");
            }

            // TODO: Add business rule validation here
            // Example: Check if template is being used in active evaluations
            // if (await IsTemplateInUse(request.Id, ct))
            // {
            //     throw new InvalidOperationException("Cannot delete template that is currently in use.");
            // }

            await surveyTemplateRepository.SoftDeleteAsync(request.Id, cancellationToken);

            logger.LogInformation("SurveyTemplate Id: {Id} soft-deleted by UserId: {UserId}", request.Id, user.Id);
        }
    }
}
