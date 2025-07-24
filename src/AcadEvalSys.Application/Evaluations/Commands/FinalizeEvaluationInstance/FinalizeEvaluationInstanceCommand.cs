using MediatR;

namespace AcadEvalSys.Application.Evaluations.Commands.FinalizeEvaluationInstance;

public class FinalizeEvaluationInstanceCommand : IRequest<bool>
{
    public Guid EvaluationInstanceId { get; set; }
    public bool ForceClose { get; set; }

    public FinalizeEvaluationInstanceCommand(Guid evaluationInstanceId, bool forceClose = false)
    {
        EvaluationInstanceId = evaluationInstanceId;
        ForceClose = forceClose;
    }
}
