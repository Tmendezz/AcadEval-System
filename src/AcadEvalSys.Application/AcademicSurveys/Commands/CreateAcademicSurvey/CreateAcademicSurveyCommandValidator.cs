using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

            RuleFor(x => x)
                .Must(x => !(x.PublishAt.HasValue && x.CloseAt.HasValue) || x.PublishAt <= x.CloseAt)
                .WithMessage("PublishAt no puede ser mayor que CloseAt.");
        }
    }
}
