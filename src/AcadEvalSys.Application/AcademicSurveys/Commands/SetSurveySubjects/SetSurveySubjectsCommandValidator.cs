using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SetSurveySubjects
{
    public class SetSurveySubjectsCommandValidator : AbstractValidator<SetSurveySubjectsCommand>
    {
        public SetSurveySubjectsCommandValidator()
        {
            RuleFor(x => x.SurveyId)
                .NotEmpty();

            RuleFor(x => x.SubjectIds)
                .NotNull().WithMessage("SubjectIds no puede ser null.")
                .Must(list => list.Count > 0).WithMessage("Debe especificar al menos una materia.")
                .Must(list => list.Distinct().Count() == list.Count).WithMessage("Hay materias duplicadas.");

            RuleForEach(x => x.SubjectIds)
                .NotEmpty().WithMessage("Cada SubjectId debe ser distinto de Guid.Empty.");
        }
    }
}
