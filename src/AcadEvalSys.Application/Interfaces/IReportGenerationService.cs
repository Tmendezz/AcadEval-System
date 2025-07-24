namespace AcadEvalSys.Application.Interfaces;

public interface IReportGenerationService
{
    void EnqueueEvaluationReports(Guid evaluationInstanceId, string adminUserId);
}
