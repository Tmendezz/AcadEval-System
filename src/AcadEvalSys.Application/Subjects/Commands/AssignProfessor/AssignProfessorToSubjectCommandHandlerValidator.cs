using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.AssignProfessor;

public class AssignProfessorToSubjectCommandHandlerValidator : AbstractValidator<AssignProfessorToSubjectCommand>
{
    public AssignProfessorToSubjectCommandHandlerValidator()
    {
        RuleFor(command => command.SubjectId)
            .NotEmpty().WithMessage("Subject ID cannot be empty.");

        RuleFor(command => command.ProfessorId)
            .NotEmpty().WithMessage("Professor ID cannot be empty.");
    }
}