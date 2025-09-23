using FluentValidation;
using System;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommandValidator : AbstractValidator<CloseAcademicSurveyCommand>
    {
        public CloseAcademicSurveyCommandValidator()
        {
            RuleFor(x => x.SurveyId)
                .NotEmpty()
                .WithMessage("El ID de la encuesta es requerido");
        }
    }
}
