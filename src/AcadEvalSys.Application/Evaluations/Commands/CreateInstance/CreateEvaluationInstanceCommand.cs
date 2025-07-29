using AcadEvalSys.Application.Evaluations.Dtos;
using MediatR;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Evaluations.Commands.CreateInstance;

public class CreateEvaluationInstanceCommand : IRequest<Guid>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PeriodFrom { get; set; }
    public DateTime PeriodTo { get; set; }
    public Semester Semester { get; set; } = Semester.First;
    public CreateCompetencyAssignmentDto[] CompetencyAssignments { get; set; } = [];
}