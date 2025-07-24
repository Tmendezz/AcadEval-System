using MediatR;

namespace AcadEvalSys.Application.Evaluations.Commands.UpdateEvaluationInfoInstance;

public class UpdateEvaluationInstanceCommand : IRequest
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PeriodFrom { get; set; }
    public DateTime PeriodTo { get; set; }
}