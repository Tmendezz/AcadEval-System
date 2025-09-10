using AcadEvalSys.Application.Templates.Commands.CreateTemplate;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Surveys.Templates.Commands.CreateSurveyTemplate
{
    public sealed class CreateSurveyTemplateCommandHandler(ILogger<CreateSurveyTemplateCommandHandler> logger,
        IMapper mapper, IUserContext userContext, ISurveyTemplateRepository surveyTemplateRepository) : IRequestHandler<CreateSurveyTemplateCommand, Guid>
    {
        public async Task<Guid> Handle(CreateSurveyTemplateCommand request, CancellationToken ct)
        {
            logger.LogInformation("Creating SurveyTemplate with name: {Name} and type: {Type}",
                request.Dto.Title, request.Dto.SurveyType);

            var user = userContext.GetCurrentUser()
                ?? throw new UnauthorizedAccessException("User must be authenticated to create survey templates.");

            var exists = await surveyTemplateRepository.ExistsNameAsync(
                request.Dto.Title, request.Dto.SurveyType, excludingId: null, ct);
            if (exists)
                throw new InvalidOperationException($"Ya existe una plantilla '{request.Dto.Title}' para '{request.Dto.SurveyType}'.");

            var template = mapper.Map<SurveyTemplate>(request.Dto);
            template.CreatedAt = DateTime.UtcNow;
            template.CreatedByUserId = user.Id;

            var newId = await surveyTemplateRepository.CreateAsync(template, ct);

            logger.LogInformation("SurveyTemplate created with ID: {Id}", newId);
            return newId;
        }
    }
}
