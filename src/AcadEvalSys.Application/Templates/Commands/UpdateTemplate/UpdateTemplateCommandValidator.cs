using FluentValidation;

namespace AcadEvalSys.Application.Templates.Commands.UpdateTemplate
{
    public class UpdateSurveyTemplateCommandValidator : AbstractValidator<UpdateSurveyTemplateCommand>
    {
        public UpdateSurveyTemplateCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Template ID is required.");

            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Template name is required.")
                .MaximumLength(200)
                .WithMessage("Template name cannot exceed 200 characters.");

            RuleFor(x => x.SurveyType)
                .IsInEnum()
                .WithMessage("Invalid survey type.");

            // If not draft, require at least one question
            When(x => !x.IsDraft, () =>
            {
                RuleFor(x => x.Questions)
                    .NotEmpty()
                    .WithMessage("At least one question is required to publish the template.");
            });

            // Validate each question
            RuleForEach(x => x.Questions).ChildRules(q =>
            {
                q.RuleFor(y => y.Text)
                    .NotEmpty()
                    .WithMessage("Question text is required.")
                    .MaximumLength(500)
                    .WithMessage("Question text cannot exceed 500 characters.");

                q.RuleFor(y => y.Type)
                    .NotEmpty()
                    .WithMessage("Question type is required.")
                    .Must(type => new[] { "SingleChoice", "MultipleChoice", "OpenText" }.Contains(type)) // ✅ Usar nombres de enum
                    .WithMessage("Invalid question type. Allowed types: SingleChoice, MultipleChoice, OpenText.");

                q.RuleFor(y => y.Order)
                    .GreaterThan(0)
                    .WithMessage("Question order must be greater than 0.");

                // If question is choice type, require options
                q.When(y => y.Type is "single_choice" or "multiple_choice", () =>
                {
                    q.RuleFor(y => y.Options)
                        .NotEmpty()
                        .WithMessage("Choice questions must have at least one option.");

                    q.RuleForEach(y => y.Options).ChildRules(o =>
                    {
                        o.RuleFor(z => z.Value)
                            .GreaterThan(0)
                            .WithMessage("Option value must be greater than 0.");

                        o.RuleFor(z => z.Text)
                            .NotEmpty()
                            .WithMessage("Option text is required.")
                            .MaximumLength(200)
                            .WithMessage("Option text cannot exceed 200 characters.");

                        o.RuleFor(z => z.Order)
                            .GreaterThan(0)
                            .WithMessage("Option order must be greater than 0.");
                    });
                });
            });

            // Cross-field validations
            RuleFor(x => x)
                .Custom((template, ctx) =>
                {
                    // Check for duplicate question orders
                    var duplicateQuestionOrders = template.Questions
                        .GroupBy(q => q.Order)
                        .Where(g => g.Count() > 1)
                        .Select(g => g.Key)
                        .ToList();

                    if (duplicateQuestionOrders.Any())
                    {
                        ctx.AddFailure($"Duplicate question orders found: {string.Join(", ", duplicateQuestionOrders)}");
                    }

                    // Check for duplicate option orders within each question
                    foreach (var question in template.Questions.Where(q => q.Options.Any()))
                    {
                        var duplicateOptionOrders = question.Options
                            .GroupBy(o => o.Order)
                            .Where(g => g.Count() > 1)
                            .Select(g => g.Key)
                            .ToList();

                        if (duplicateOptionOrders.Any())
                        {
                            ctx.AddFailure($"Question '{question.Text}' has duplicate option orders: {string.Join(", ", duplicateOptionOrders)}");
                        }

                        // Check for duplicate option values
                        var duplicateOptionValues = question.Options
                            .GroupBy(o => o.Value)
                            .Where(g => g.Count() > 1)
                            .Select(g => g.Key)
                            .ToList();

                        if (duplicateOptionValues.Any())
                        {
                            ctx.AddFailure($"Question '{question.Text}' has duplicate option values: {string.Join(", ", duplicateOptionValues)}");
                        }
                    }
                });
        }
    }
}