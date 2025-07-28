using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.CreateSubject;

public class CreateSubjectCommandValidator : AbstractValidator<CreateSubjectCommand>
{
    public CreateSubjectCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(250).WithMessage("Description must not exceed 250 characters.");

        RuleFor(x => x.Year)
            .IsInEnum().WithMessage("Year must be a valid enum value.");

        // ProfessorId es opcional, no requiere validación
        // TechnicalCareerId viene del path, no requiere validación
    }
}