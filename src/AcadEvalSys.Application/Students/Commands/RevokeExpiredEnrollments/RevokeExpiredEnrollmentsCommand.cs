using MediatR;
using AcadEvalSys.Application.Students.Dtos;

namespace AcadEvalSys.Application.Students.Commands.RevokeExpiredEnrollments;

/// <summary>
/// Comando para revocar automáticamente todas las inscripciones expiradas del año anterior
/// </summary>
public record RevokeExpiredEnrollmentsCommand : IRequest<RevokeExpiredEnrollmentsResult>
{
    /// <summary>
    /// Usuario que ejecuta la operación
    /// </summary>
    public string ExecutedBy { get; init; } = string.Empty;
}
