using FluentValidation;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse;

public class SubmitSurveyResponseCommandValidator : AbstractValidator<SubmitSurveyResponseCommand>
{
    public SubmitSurveyResponseCommandValidator()
    {
        RuleFor(x => x.AcademicSurveySubjectId)
            .NotEmpty()
            .WithMessage("El ID de la encuesta-asignatura es requerido");

        RuleFor(x => x.Answers)
            .NotNull()
            .WithMessage("Las respuestas son requeridas")
            .Must(answers => answers.Count > 0)
            .WithMessage("Debe proporcionar al menos una respuesta");

        RuleForEach(x => x.Answers)
            .SetValidator(new SubmitSurveyAnswerValidator());
    }
}

public class SubmitSurveyAnswerValidator : AbstractValidator<AcadEvalSys.Application.AcademicSurveys.Dtos.SubmitSurveyAnswerDto>
{
    public SubmitSurveyAnswerValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("El ID de la pregunta es requerido");
    }
}