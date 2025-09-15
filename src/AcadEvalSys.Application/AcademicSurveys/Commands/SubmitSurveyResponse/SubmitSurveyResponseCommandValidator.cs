using FluentValidation;
using AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommandValidator : AbstractValidator<SubmitSurveyResponseCommand>
    {
        public SubmitSurveyResponseCommandValidator()
        {
            RuleFor(x => x.AcademicSurveySubjectId)
                .NotEmpty();

            RuleFor(x => x.Answers)
                .NotNull()
                .WithMessage("Debe enviar el arreglo de respuestas.")
                .Must(a => a.Count > 0)
                .WithMessage("Debe incluir al menos una respuesta.");

            RuleForEach(x => x.Answers).ChildRules(answer =>
            {
                answer.RuleFor(a => a.QuestionId)
                    .NotEmpty()
                    .WithMessage("QuestionId es obligatorio.");

                // Permitir SelectedValue o Text (según tipo) — validación específica completa en handler (porque se necesita conocer el tipo real).
                answer.RuleFor(a => new { a.SelectedValue, a.Text })
                    .Must(v => v.SelectedValue.HasValue || !string.IsNullOrWhiteSpace(v.Text))
                    .WithMessage("Cada respuesta debe tener SelectedValue o Text.");
            });

            // Duplicados
            RuleFor(x => x.Answers)
                .Must(ans => ans.Select(a => a.QuestionId).Distinct().Count() == ans.Count)
                .WithMessage("No se permiten respuestas duplicadas para la misma pregunta.");
        }
    }
}