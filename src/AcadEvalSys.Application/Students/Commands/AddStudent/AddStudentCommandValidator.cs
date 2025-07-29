using FluentValidation;

namespace AcadEvalSys.Application.Students.Commands.AddStudent;

public class AddStudentCommandValidator : AbstractValidator<AddStudentCommand>
{
    public AddStudentCommandValidator()
    {
        RuleFor(dto => dto.Name)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.")
            .Length(3, 100)
            .WithMessage("El nombre debe tener entre 3 y 100 caracteres.");

        RuleFor(dto => dto.Email)
            .NotEmpty()
            .WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El correo electrónico no es válido.");

        RuleFor(dto => dto.Password)
            .NotEmpty()
            .WithMessage("La contraseña es obligatoria.")
            .MinimumLength(6)
            .WithMessage("La contraseña debe tener al menos 6 caracteres.");
    }
}