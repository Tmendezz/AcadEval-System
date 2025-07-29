using FluentValidation;

namespace AcadEvalSys.Application.Competencies.Commands.CreateCompetency;

public class CreateCompetencyCommandValidator : AbstractValidator<CreateCompetencyCommand>
{
    public CreateCompetencyCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(100);

        RuleFor(c => c.Description)
            .MaximumLength(250);

        RuleFor(c => c.Type)
            .IsInEnum();

        RuleFor(x => x.CompetencyLevelDescriptions)
            .NotNull()
            .Must(dict => dict.Count == 4 && System.Enum.GetValues(typeof(AcadEvalSys.Domain.Enums.CompetencyLevel)).Cast<AcadEvalSys.Domain.Enums.CompetencyLevel>().All(l => dict.ContainsKey(l)))
            .WithMessage("Se deben especificar exactamente los 4 niveles de competencia: Inicial, Intermedio, Avanzado y Excelente.");
    }
}
