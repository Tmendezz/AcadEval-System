using FluentValidation;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommandValidator : AbstractValidator<PublishAcademicSurveyCommand>
    {
        public PublishAcademicSurveyCommandValidator()
        {
            RuleFor(x => x.CloseAt)
                .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
                .WithMessage("La fecha de cierre debe ser futura");
        }
    }
}


