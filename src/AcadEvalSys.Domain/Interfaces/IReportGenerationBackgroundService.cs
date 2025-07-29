namespace AcadEvalSys.Domain.Interfaces;

public interface IReportGenerationBackgroundService
{
    Task EnqueueReportGenerationAsync(Guid evaluationInstanceId);
}
