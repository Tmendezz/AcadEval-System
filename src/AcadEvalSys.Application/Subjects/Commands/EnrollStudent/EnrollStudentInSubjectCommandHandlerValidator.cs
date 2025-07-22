using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.EnrollStudent;

public class EnrollStudentInSubjectCommandHandlerValidator : AbstractValidator<EnrollStudentInSubjectCommand>
{
    public EnrollStudentInSubjectCommandHandlerValidator()
    {
        RuleFor(command => command.SubjectId)
            .NotEmpty().WithMessage("Subject ID cannot be empty.");

        RuleFor(command => command.StudentId)
            .NotEmpty().WithMessage("Student ID cannot be empty.");
    }
}