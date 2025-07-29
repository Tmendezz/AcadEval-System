using FluentValidation;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;

public class CompleteStudentAssessmentCommandValidator : AbstractValidator<CompleteStudentAssessmentCommand>
{
    public CompleteStudentAssessmentCommandValidator()
    {
        RuleFor(x => x.CompetencyLevel)
            .IsInEnum().WithMessage("Competency Level must be a valid enum value.");
    }
}