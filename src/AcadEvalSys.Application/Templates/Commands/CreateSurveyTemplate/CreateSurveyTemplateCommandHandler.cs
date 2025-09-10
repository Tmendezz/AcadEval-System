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
            logger.LogInformation("Creating SurveyTemplate with name: {Name}, description: {Description} and type: {Type}",
                request.Name, request.Description, request.SurveyType);

            logger.LogInformation("Questions count: {QuestionCount}", request.Questions.Count);
            
            // Log detallado de cada pregunta
            for (int i = 0; i < request.Questions.Count; i++)
            {
                var q = request.Questions[i];
                logger.LogInformation("Question {Index}: Text='{Text}', Type={Type}, Order={Order}, Required={Required}, Options={OptionCount}", 
                    i, q.Text, q.Type, q.Order, q.Required, q.Options.Count);
                
                for (int j = 0; j < q.Options.Count; j++)
                {
                    var opt = q.Options[j];
                    logger.LogInformation("  Option {OptIndex}: Text='{OptText}', Value='{OptValue}', Order={OptOrder}", 
                        j, opt.Text, opt.Value, opt.Order);
                }
            }

            var user = userContext.GetCurrentUser()
                ?? throw new UnauthorizedAccessException("User must be authenticated to create survey templates.");

            var exists = await surveyTemplateRepository.ExistsNameAsync(
                request.Name, request.SurveyType, excludingId: null, ct);
            if (exists)
                throw new InvalidOperationException($"Ya existe una plantilla '{request.Name}' para '{request.SurveyType}'.");

            var template = mapper.Map<SurveyTemplate>(request);
            template.CreatedAt = DateTime.UtcNow;
            template.CreatedByUserId = user.Id;

            logger.LogInformation("Mapped template: Name='{Name}', Description='{Description}', Questions={QuestionCount}", 
                template.Name, template.Description, template.Questions.Count);

            var newId = await surveyTemplateRepository.CreateAsync(template, ct);

            logger.LogInformation("SurveyTemplate created with ID: {Id}", newId);
            return newId;
        }
    }
}
