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

            /*RuleFor(x => x.Audience)
                .NotEmpty().WithMessage("Debe configurar al menos una audiencia.");

            RuleForEach(x => x.Audience).ChildRules(audience =>
            {
                audience.RuleFor(a => a.TechnicalCareerId)
                    .NotEmpty().WithMessage("El ID de la tecnicatura es requerido.");

                audience.RuleFor(a => a.SelectedYears)
                    .NotEmpty().WithMessage("Debe seleccionar al menos un año para cada tecnicatura.")
                    .Must(years => years.All(year => year >= CareerYear.First && year <= CareerYear.Third))
                    .WithMessage("Los años de cursado deben estar entre First y Third.");
            });*/

            RuleFor(x => x)
                .Must(x => !(x.PublishAt.HasValue && x.CloseAt.HasValue) || x.PublishAt <= x.CloseAt)
                .WithMessage("PublishAt no puede ser mayor que CloseAt.");
        }
    }
}
