using AcadEvalSys.Application.Templates.Commands.CreateTemplate;
using AcadEvalSys.Domain.Enums;
using FluentValidation;
using System.Linq;

public class CreateSurveyTemplateCommandValidator : AbstractValidator<CreateSurveyTemplateCommand>
{
    public CreateSurveyTemplateCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es requerido.")
            .MaximumLength(200).WithMessage("El título no puede exceder los 200 caracteres.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("La descripción no puede exceder los 500 caracteres.");

        RuleFor(x => x.SurveyType)
            .IsInEnum().WithMessage("Tipo de encuesta inválido.");

        // Si no es borrador, al menos una pregunta
        When(x => !x.IsDraft, () =>
        {
            RuleFor(x => x.Questions)
                .NotEmpty().WithMessage("Debe incluir al menos una pregunta para publicar.");
        });

        // Validación de cada pregunta
        RuleForEach(x => x.Questions).ChildRules(q =>
        {
            q.RuleFor(y => y.Text).NotEmpty().WithMessage("El texto de la pregunta es requerido.");
            q.RuleFor(y => y.Type).IsInEnum().WithMessage("El tipo de la pregunta es requerido.");
            q.RuleFor(y => y.Order).GreaterThan(0).WithMessage("El orden de la pregunta debe ser > 0.");

            // Si es de opciones, exigir opciones y validarlas
            q.When(y => y.Type is QuestionType.SingleChoice or QuestionType.MultipleChoice, () =>
            {
                q.RuleFor(y => y.Options)
                    .NotEmpty().WithMessage("Las preguntas de opción deben tener al menos una opción.");

                q.RuleForEach(y => y.Options).ChildRules(o =>
                {
                    o.RuleFor(z => z.Value).NotEmpty().MaximumLength(100);
                    o.RuleFor(z => z.Text).NotEmpty();
                    o.RuleFor(z => z.Order).GreaterThan(0);
                });
            });

            // Para preguntas de texto abierto, no deben tener opciones
            q.When(y => y.Type == QuestionType.OpenText, () =>
            {
                q.RuleFor(y => y.Options)
                    .Empty().WithMessage("Las preguntas de texto abierto no deben tener opciones.");
            });
        });

        // Reglas cruzadas (órdenes/values únicos)
        RuleFor(x => x).Custom((command, ctx) =>
        {
            var dupQOrders = command.Questions.GroupBy(q => q.Order).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
            if (dupQOrders.Any())
                ctx.AddFailure($"Hay órdenes de preguntas repetidos: {string.Join(", ", dupQOrders)}");

            foreach (var q in command.Questions)
            {
                if (q.Options != null && q.Options.Any())
                {
                    var dupOptOrders = q.Options.GroupBy(o => o.Order).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
                    if (dupOptOrders.Any())
                        ctx.AddFailure($"Pregunta '{q.Text}': órdenes de opciones repetidos: {string.Join(", ", dupOptOrders)}");

                    var dupOptValues = q.Options.Where(o => !string.IsNullOrEmpty(o.Value))
                        .GroupBy(o => o.Value.Trim()).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
                    if (dupOptValues.Any())
                        ctx.AddFailure($"Pregunta '{q.Text}': values de opciones repetidos: {string.Join(", ", dupOptValues)}");
                }
            }
        });
    }
}