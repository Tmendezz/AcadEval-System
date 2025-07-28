using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.AssignProfessor;

public class AssignProfessorToSubjectCommandHandlerValidator : AbstractValidator<AssignProfessorToSubjectCommand>
{
    public AssignProfessorToSubjectCommandHandlerValidator()
    {
        // SubjectId viene del path, no requiere validación
        // TechnicalCareerId viene del path, no requiere validación

        RuleFor(command => command.ProfessorId)
            .NotEmpty().WithMessage("Professor ID cannot be empty.");
    }
}