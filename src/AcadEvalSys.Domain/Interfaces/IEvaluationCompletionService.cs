using System.Threading.Tasks;
using System;

namespace AcadEvalSys.Domain.Interfaces;

/// <summary>
/// Defines the contract for a service that handles logic after an evaluation is completed.
/// </summary>
public interface IEvaluationCompletionService
{
    /// <summary>
    /// Processes the necessary actions after a student completes all assessments for an evaluation instance.
    /// </summary>
    /// <param name="studentId">The ID of the student.</param>
    /// <param name="evaluationInstanceId">The ID of the evaluation instance.</param>
    Task ProcessCompletedEvaluationAsync(string studentId, Guid evaluationInstanceId);
}