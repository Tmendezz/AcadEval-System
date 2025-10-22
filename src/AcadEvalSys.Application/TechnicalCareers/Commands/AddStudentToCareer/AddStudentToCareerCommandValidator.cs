using FluentValidation;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.AddStudentToCareer;

public class AddStudentToCareerCommandValidator : AbstractValidator<AddStudentToCareerCommand>
{
    public AddStudentToCareerCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es requerido.")
            .EmailAddress().WithMessage("El email no es válido.")
            .MaximumLength(255).WithMessage("El email no puede exceder 255 caracteres.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es requerido.")
            .MinimumLength(2).WithMessage("El nombre debe tener al menos 2 caracteres.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es requerida.")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.")
            .MaximumLength(100).WithMessage("La contraseña no puede exceder 100 caracteres.");

        RuleFor(x => x.TechnicalCareerId)
            .NotEmpty().WithMessage("La carrera técnica es requerida.");

        RuleFor(x => x.CurrentYear)
            .IsInEnum().WithMessage("El año académico debe ser válido (First, Second, Third).");
    }
}
