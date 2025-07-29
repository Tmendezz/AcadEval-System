using FluentValidation;

namespace AcadEvalSys.Application.Subjects.Commands.UpdateSubject;

public class UpdateSubjectCommandHandlerValidator : AbstractValidator<UpdateSubjectCommand>
{
    public UpdateSubjectCommandHandlerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(50).WithMessage("Name must not exceed 50 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(250).WithMessage("Description must not exceed 250 characters.");

        RuleFor(x => x.Year)
            .IsInEnum().WithMessage("Year must be a valid enum value.");

        // ProfessorId es opcional, no requiere validación
    }
}