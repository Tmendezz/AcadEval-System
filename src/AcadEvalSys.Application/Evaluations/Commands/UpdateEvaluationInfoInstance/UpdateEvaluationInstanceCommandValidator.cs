using FluentValidation;

namespace AcadEvalSys.Application.Evaluations.Commands.UpdateEvaluationInfoInstance;

public class UpdateEvaluationInstanceCommandValidator : AbstractValidator<UpdateEvaluationInstanceCommand>
{
    public UpdateEvaluationInstanceCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("El ID de la evaluación es requerido");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("El título es requerido")
            .MaximumLength(200)
            .WithMessage("El título no puede exceder 200 caracteres");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("La descripción es requerida")
            .MaximumLength(1000)
            .WithMessage("La descripción no puede exceder 1000 caracteres");

        RuleFor(x => x.PeriodFrom)
            .NotEmpty()
            .WithMessage("La fecha de inicio es requerida")
            .Must(BeAValidDate)
            .WithMessage("La fecha de inicio debe ser válida");

        RuleFor(x => x.PeriodTo)
            .NotEmpty()
            .WithMessage("La fecha de fin es requerida")
            .Must(BeAValidDate)
            .WithMessage("La fecha de fin debe ser válida")
            .GreaterThan(x => x.PeriodFrom)
            .WithMessage("La fecha de fin debe ser posterior a la fecha de inicio");

        RuleFor(x => x)
            .Must(HaveValidDateRange)
            .WithMessage("El período de evaluación debe ser de al menos 1 día y no exceder 1 año");
    }

    private static bool BeAValidDate(DateTime date)
    {
        return date != default && date > DateTime.MinValue && date < DateTime.MaxValue;
    }

    private static bool HaveValidDateRange(UpdateEvaluationInstanceCommand command)
    {
        if (command.PeriodFrom == default || command.PeriodTo == default)
            return false;

        var timeSpan = command.PeriodTo - command.PeriodFrom;
        
        // Mínimo 1 día, máximo 1 año
        return timeSpan.TotalDays >= 1 && timeSpan.TotalDays <= 365;
    }
}