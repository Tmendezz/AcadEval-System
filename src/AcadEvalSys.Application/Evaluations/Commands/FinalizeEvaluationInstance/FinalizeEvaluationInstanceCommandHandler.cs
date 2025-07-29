using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Commands.FinalizeEvaluationInstance;

public class FinalizeEvaluationInstanceCommandHandler(
    ILogger<FinalizeEvaluationInstanceCommandHandler> logger,
    ICompetencyEvaluationInstanceRepository evaluationInstanceRepository,
    IUserContext userContext,
    IReportGenerationBackgroundService reportGenerationBackgroundService)
    : IRequestHandler<FinalizeEvaluationInstanceCommand, bool>
{
    public async Task<bool> Handle(FinalizeEvaluationInstanceCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Admin finalizing evaluation instance {InstanceId} with ForceClose: {ForceClose}", 
            request.EvaluationInstanceId, request.ForceClose);

        var user = userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedAccessException("User must be authenticated to perform this action");
        }

        // Obtener la instancia de evaluación con todos los datos necesarios
        var instance = await evaluationInstanceRepository.GetByIdAsync(request.EvaluationInstanceId);
        if (instance == null)
        {
            logger.LogWarning("Evaluation instance {InstanceId} not found", request.EvaluationInstanceId);
            throw new NotFoundException(nameof(CompetencyEvaluationInstance), request.EvaluationInstanceId.ToString());
        }

        // TODO -> Descomentars
        /*
        if (instance.Status == EvaluationStatus.Completed)
        {
            logger.LogInformation("Evaluation instance {InstanceId} is already completed", request.EvaluationInstanceId);
            return true;
        }
        */

        // Verificar condiciones de finalización
        var (completedAssignments, totalAssignments, allProfessorsCompleted) = ValidateAssignmentCompletion(instance, request.ForceClose, request.EvaluationInstanceId);

        // Finalizar la instancia
        instance.Status = EvaluationStatus.Completed;
        instance.UpdatedAt = DateTime.UtcNow;
        instance.UpdatedByUserId = user.Id;

        await evaluationInstanceRepository.UpdateAsync(instance);

        var logLevel = allProfessorsCompleted ? LogLevel.Information : LogLevel.Warning;
        logger.Log(logLevel, "Evaluation instance {InstanceId} finalized by admin {AdminId}. Status: {Completed}/{Total} assignments completed, ForceClose: {ForceClose}", 
            request.EvaluationInstanceId, user.Id, completedAssignments, totalAssignments, request.ForceClose);

        // Encolar la generación de reportes en background
        try
        {
            await reportGenerationBackgroundService.EnqueueReportGenerationAsync(request.EvaluationInstanceId);
            logger.LogInformation("Report generation job enqueued successfully for evaluation instance {InstanceId}", request.EvaluationInstanceId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to enqueue report generation for evaluation instance {InstanceId}", request.EvaluationInstanceId);
        }

        return true;
    }

    private (int CompletedAssignments, int TotalAssignments, bool AllProfessorsCompleted) ValidateAssignmentCompletion(CompetencyEvaluationInstance instance, bool forceClose, Guid evaluationInstanceId)
    {
        // Obtener estadísticas de asignaciones
        var allAssignments = instance.ProfessorCompetencyAssignments?.ToList() ?? new List<ProfessorCompetencyAssignment>();
        var completedAssignments = allAssignments.Count(a => a.Status == ProfessorAssignmentStatus.Completed);
        var totalAssignments = allAssignments.Count;
        
        logger.LogInformation("Evaluation instance {InstanceId} statistics: {Completed}/{Total} professor assignments completed", 
            evaluationInstanceId, completedAssignments, totalAssignments);

        // Verificar condiciones de finalización
        var allProfessorsCompleted = completedAssignments == totalAssignments && totalAssignments > 0;
        
        if (!allProfessorsCompleted && !forceClose)
        {
            logger.LogWarning("Cannot finalize evaluation instance {InstanceId}: Not all professors completed ({Completed}/{Total}) and ForceClose is false", 
                evaluationInstanceId, completedAssignments, totalAssignments);
            
            throw new InvalidOperationException($"Cannot finalize evaluation: {completedAssignments} of {totalAssignments} professor assignments completed. Use ForceClose=true to override.");
        }

        return (completedAssignments, totalAssignments, allProfessorsCompleted);
    }
}
