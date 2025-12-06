using AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse;
using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using FluentValidation;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse;

public class SubmitSurveyResponseCommandValidator : AbstractValidator<SubmitSurveyResponseCommand>
{
    public SubmitSurveyResponseCommandValidator()
    {
        RuleFor(x => x.SurveySubjectId)
            .NotEmpty()
            .WithMessage("El surveySubjectId es requerido");

        RuleFor(x => x.SubjectAnswers)
            .NotNull()
            .WithMessage("Las respuestas son requeridas")
            .Must(answers => answers!.Count > 0)
            .WithMessage("Debe proporcionar al menos una respuesta");

        // No permitir preguntas duplicadas en las respuestas
        RuleFor(x => x.SubjectAnswers)
            .Must(answers => answers!.Select(a => a.QuestionId).Distinct().Count() == answers!.Count)
            .WithMessage("No se permiten preguntas duplicadas en las respuestas");

        RuleForEach(x => x.SubjectAnswers!)
            .SetValidator(new SubmitSurveyAnswerValidator());
    }
}

public class SubmitSurveyAnswerValidator : AbstractValidator<SubmitSurveyAnswerDto>
{
    public SubmitSurveyAnswerValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("El ID de la pregunta es requerido");
        RuleFor(x => x.Text)
            .MaximumLength(1000)
            .WithMessage("El texto no puede exceder los 1000 caracteres.");

        // Debe proveer texto o seleccionar una opción
        RuleFor(x => x)
            .Must(a => a.SelectedValue.HasValue || !string.IsNullOrWhiteSpace(a.Text))
            .WithMessage("Debe proporcionar texto o seleccionar una opción");
    }
}