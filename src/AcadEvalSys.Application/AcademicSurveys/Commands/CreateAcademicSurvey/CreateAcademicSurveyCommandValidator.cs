using AcadEvalSys.Domain.Enums;
using FluentValidation;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommandValidator : AbstractValidator<CreateAcademicSurveyCommand>
    {
        public CreateAcademicSurveyCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("El título es requerido.")
                .Length(5, 200).WithMessage("El título debe tener entre 5 y 200 caracteres.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("La descripción no puede exceder 1000 caracteres.");
         
            RuleFor(x => x.Questions)
                .NotEmpty().WithMessage("Debe incluir al menos una pregunta.")
                .Must(q => q.Count <= 50).WithMessage("No puede tener más de 50 preguntas.");

            RuleFor(x => x.Audience)
                .NotEmpty().WithMessage("Debe configurar al menos una audiencia.");
            
            RuleFor(x => x.PublishAt)
                .NotEmpty().WithMessage("La fecha de publicación es requerida.")
                .GreaterThanOrEqualTo(DateTime.Today)
                .WithMessage("La fecha de publicación no puede ser anterior a hoy.");

            RuleFor(x => x.CloseAt)
                .NotEmpty().WithMessage("La fecha de cierre es requerida.")
                .GreaterThan(x => x.PublishAt)
                .WithMessage("La fecha de cierre debe ser posterior a la fecha de publicación.")
                .GreaterThan(DateTime.Today)
                .WithMessage("La fecha de cierre no puede ser anterior a hoy.");

        }
    }
}
