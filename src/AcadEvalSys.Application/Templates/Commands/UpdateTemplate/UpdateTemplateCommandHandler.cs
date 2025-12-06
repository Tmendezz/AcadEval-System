using AcadEvalSys.Application.Templates.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Templates.Commands.UpdateTemplate
{
    public class UpdateSurveyTemplateCommandHandler(
        ILogger<UpdateSurveyTemplateCommandHandler> logger,
        IUserContext userContext,
        ISurveyTemplateRepository surveyTemplateRepository) : IRequestHandler<UpdateSurveyTemplateCommand>
    {
        public async Task Handle(UpdateSurveyTemplateCommand request, CancellationToken ct)
        {
            logger.LogInformation("Updating SurveyTemplate Id: {Id}", request.Id);

            var user = userContext.GetCurrentUser();
            if (user == null)
            {
                throw new UnauthorizedAccessException("Current user context is not available. User must be authenticated to update survey templates.");
            }

            // Validate existence
            var existingTemplate = await surveyTemplateRepository.GetTemplateByIdAsync(request.Id, includeChildren: true, ct);
            if (existingTemplate is null)
            {
                logger.LogWarning("SurveyTemplate Id: {Id} not found.", request.Id);
                throw new NotFoundException(nameof(SurveyTemplate), request.Id.ToString());
            }

            // Check for duplicate names if the name is being changed
            if (!string.Equals(existingTemplate.Title, request.Title, StringComparison.OrdinalIgnoreCase))
            {
                var nameExists = await surveyTemplateRepository.ExistsNameAsync(request.Title, request.SurveyType, request.Id, ct);
                if (nameExists)
                {
                    logger.LogWarning("SurveyTemplate with name '{Name}' and type '{Type}' already exists", request.Title, request.SurveyType);
                    throw new InvalidOperationException($"A survey template with the name '{request.Title}' and type '{request.SurveyType}' already exists.");
                }
            }

            // TODO: Add business rule validation
            // Check if template is being used in active evaluations when changing from draft to published
            // if (existingTemplate.IsDraft && !request.IsDraft)
            // {
            //     var isInUse = await surveyTemplateRepository.IsTemplateInUseAsync(request.Id, ct);
            //     if (isInUse)
            //     {
            //         throw new InvalidOperationException("Cannot publish template while it's being used in active evaluations.");
            //     }
            // }

            // Update template properties
            existingTemplate.Title = request.Title;
            existingTemplate.Description = request.Description;
            existingTemplate.SurveyType = request.SurveyType;
            existingTemplate.IsDraft = request.IsDraft;
            existingTemplate.UpdatedAt = DateTime.UtcNow;
            existingTemplate.UpdatedByUserId = user.Id;

            // If not draft, increment version
            if (!request.IsDraft && existingTemplate.IsDraft)
            {
                existingTemplate.Version += 1;
            }

            // Update questions
            await UpdateQuestionsAsync(existingTemplate, request.Questions);

            await surveyTemplateRepository.UpdateAsync(existingTemplate, ct);

            logger.LogInformation("SurveyTemplate Id: {Id} updated successfully by UserId: {UserId}", request.Id, user.Id);
        }

        private static async Task UpdateQuestionsAsync(SurveyTemplate template, List<UpdateSurveyTemplateQuestionDto> questionDtos)
        {
            // Create a list to track which questions to keep
            var questionsToKeep = new List<SurveyTemplateQuestion>();

            foreach (var questionDto in questionDtos)
            {
                SurveyTemplateQuestion question;

                if (questionDto.Id.HasValue)
                {
                    // Update existing question
                    question = template.Questions.FirstOrDefault(q => q.Id == questionDto.Id.Value);
                    if (question == null)
                    {
                        throw new NotFoundException(nameof(SurveyTemplateQuestion), questionDto.Id.Value.ToString());
                    }
                }
                else
                {
                    // Create new question
                    question = new SurveyTemplateQuestion
                    {
                        Id = Guid.NewGuid(),
                        TemplateId = template.Id,
                        Options = new List<SurveyTemplateQuestionOption>()
                    };
                    template.Questions.Add(question);
                }

                // Update question properties
                question.Text = questionDto.Text;
                if (!Enum.TryParse<QuestionType>(questionDto.Type, ignoreCase: true, out var questionType))
                {
                    throw new ArgumentException($"Invalid question type: {questionDto.Type}");
                }
                question.Type = questionType;
                question.Order = questionDto.Order;
                question.isRequired = questionDto.IsRequired;

                // Update options
                await UpdateQuestionOptionsAsync(question, questionDto.Options);

                questionsToKeep.Add(question);
            }

            // Remove questions that are no longer present
            var questionsToRemove = template.Questions.Where(q => !questionsToKeep.Contains(q)).ToList();
            foreach (var questionToRemove in questionsToRemove)
            {
                template.Questions.Remove(questionToRemove);
            }
        }

        private static async Task UpdateQuestionOptionsAsync(SurveyTemplateQuestion question, List<UpdateSurveyTemplateQuestionOptionDto> optionDtos)
        {
            var optionsToKeep = new List<SurveyTemplateQuestionOption>();

            foreach (var optionDto in optionDtos)
            {
                SurveyTemplateQuestionOption option;

                if (optionDto.Id.HasValue)
                {
                    // Update existing option
                    option = question.Options.FirstOrDefault(o => o.Id == optionDto.Id.Value);
                    if (option == null)
                    {
                        throw new NotFoundException(nameof(SurveyTemplateQuestionOption), optionDto.Id.Value.ToString());
                    }
                }
                else
                {
                    // Create new option
                    option = new SurveyTemplateQuestionOption
                    {
                        Id = Guid.NewGuid(),
                        TemplateQuestionId = question.Id
                    };
                    question.Options.Add(option);
                }

                // Update option properties
                option.Value = optionDto.Value;
                option.Text = optionDto.Text;
                option.Order = optionDto.Order;

                optionsToKeep.Add(option);
            }

            // Remove options that are no longer present
            var optionsToRemove = question.Options.Where(o => !optionsToKeep.Contains(o)).ToList();
            foreach (var optionToRemove in optionsToRemove)
            {
                question.Options.Remove(optionToRemove);
            }
        }
    }
}
