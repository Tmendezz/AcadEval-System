using FluentValidation;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommandValidator : AbstractValidator<SubmitSurveyResponseCommand>
    {
        public SubmitSurveyResponseCommandValidator()
        {
            RuleFor(x => x.AcademicSurveySubjectId).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Answers).NotEmpty().WithMessage("Debe enviar al menos una respuesta.");
            RuleForEach(x => x.Answers).ChildRules(a =>
            {
                a.RuleFor(z => z.QuestionId).NotEmpty(); // El resto se valida contra BD en el handler (tipo de pregunta y opciones) }); } }
            });
        }
    }
}

    
