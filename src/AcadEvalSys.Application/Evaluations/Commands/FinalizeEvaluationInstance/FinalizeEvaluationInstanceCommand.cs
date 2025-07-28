using MediatR;

namespace AcadEvalSys.Application.Evaluations.Commands.FinalizeEvaluationInstance;

public class FinalizeEvaluationInstanceCommand(Guid evaluationInstanceId, bool forceClose = false) : IRequest<bool>
{
    public Guid EvaluationInstanceId { get; set; } = evaluationInstanceId;
    public bool ForceClose { get; set; } = forceClose;
}
