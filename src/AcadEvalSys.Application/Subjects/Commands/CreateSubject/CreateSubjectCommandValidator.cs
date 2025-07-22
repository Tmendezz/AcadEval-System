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

        RuleFor(x => x.TechnicalCareerId)
            .NotEmpty().WithMessage("Technical Career ID is required.");

        RuleFor(x => x.Year)
            .IsInEnum().WithMessage("Year must be a valid enum value.");

        RuleFor(x => x.ProfessorId)
            .NotEmpty().WithMessage("Professor ID is required.");
    }
}