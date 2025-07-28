using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.EnrollStudent;

public class EnrollStudentInSubjectCommandHandlerValidator : AbstractValidator<EnrollStudentInSubjectCommand>
{
    public EnrollStudentInSubjectCommandHandlerValidator()
    {
        // SubjectId viene del path, no requiere validación
        // TechnicalCareerId viene del path, no requiere validación

        RuleFor(command => command.StudentId)
            .NotEmpty().WithMessage("Student ID cannot be empty.");
    }
}