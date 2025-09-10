using AcadEvalSys.Application.Templates.Commands.CreateTemplate;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Surveys.Templates.Commands.CreateSurveyTemplate
{
    public class CreateSurveyTemplateCommandHandler(ILogger<CreateSurveyTemplateCommandHandler> logger,
        IMapper mapper, IUserContext userContext, ISurveyTemplateRepository surveyTemplateRepository) : IRequestHandler<CreateSurveyTemplateCommand, Guid>
    {
        public async Task<Guid> Handle(CreateSurveyTemplateCommand request, CancellationToken ct)
        {
            logger.LogInformation("Creating SurveyTemplate with name: {Name} and type: {Type}",
                request.Title, request.SurveyType);

            var user = userContext.GetCurrentUser()
                ?? throw new UnauthorizedAccessException("User must be authenticated to create survey templates.");

            var exists = await surveyTemplateRepository.ExistsNameAsync(
                request.Title, request.SurveyType, excludingId: null, ct);
            if (exists)
                throw new InvalidOperationException($"Ya existe una plantilla '{request.Title}' para '{request.SurveyType}'.");

            var template = mapper.Map<SurveyTemplate>(request);
            template.CreatedAt = DateTime.UtcNow;
            template.CreatedByUserId = user.Id;

            var newId = await surveyTemplateRepository.CreateAsync(template, ct);

            logger.LogInformation("SurveyTemplate created with ID: {Id}", newId);
            return newId;
        }
    }
}
