using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommandValidator : AbstractValidator<PublishAcademicSurveyCommand>
    {
        public PublishAcademicSurveyCommandValidator()
        {
            RuleFor(x => x.SurveyId)
                .NotEmpty();

            // PublishAt opcional; si se envía, no permitir fechas muy antiguas (opcional)
            RuleFor(x => x.PublishAt)
                .Must(_ => true); // placeholder para futuras reglas
        }
    }
}
