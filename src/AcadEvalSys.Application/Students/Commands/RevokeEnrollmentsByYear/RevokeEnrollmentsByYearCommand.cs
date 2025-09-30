using MediatR;
using AcadEvalSys.Application.Students.Dtos;

namespace AcadEvalSys.Application.Students.Commands.RevokeEnrollmentsByYear;

/// <summary>
/// Comando para revocar inscripciones de un año académico específico
/// </summary>
public record RevokeEnrollmentsByYearCommand : IRequest<RevokeExpiredEnrollmentsResult>
{
    /// <summary>
    /// Año académico del cual revocar las inscripciones
    /// </summary>
    public int AcademicYear { get; init; }
    
    /// <summary>
    /// Usuario que ejecuta la operación
    /// </summary>
    public string ExecutedBy { get; init; } = string.Empty;
}
