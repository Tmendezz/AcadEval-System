using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommandValidator : AbstractValidator<CloseAcademicSurveyCommand>
    {
        public CloseAcademicSurveyCommandValidator()
        {
            RuleFor(x => x.SurveyId)
                .NotEmpty();
        }
    }
}
