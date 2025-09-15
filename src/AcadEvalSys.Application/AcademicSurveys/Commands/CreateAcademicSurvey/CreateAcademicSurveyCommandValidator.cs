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
                .MaximumLength(200);

            RuleFor(x => x.TemplateId)
                .NotEmpty().WithMessage("TemplateId es requerido.");

            RuleFor(x => x.SelectedCareerIds)
                .NotEmpty().WithMessage("Debe seleccionar al menos una tecnicatura.");

            RuleFor(x => x.SelectedYears)
                .NotEmpty().WithMessage("Debe seleccionar al menos un año de cursado.")
                .Must(years => years.All(year => year >= CareerYear.First && year <= CareerYear.Third))
                .WithMessage("Los años de cursado deben estar entre 1 y 3.");

            RuleFor(x => x)
                .Must(x => !(x.PublishAt.HasValue && x.CloseAt.HasValue) || x.PublishAt <= x.CloseAt)
                .WithMessage("PublishAt no puede ser mayor que CloseAt.");
        }
    }
}
