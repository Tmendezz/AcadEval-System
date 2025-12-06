using AcadEvalSys.Application.Services;
using AcadEvalSys.Application.Students.Dtos;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Commands.RevokeExpiredEnrollments;

/// <summary>
/// Handler para revocar automáticamente todas las inscripciones expiradas del año anterior
/// </summary>
public class RevokeExpiredEnrollmentsCommandHandler : IRequestHandler<RevokeExpiredEnrollmentsCommand, RevokeExpiredEnrollmentsResult>
{
    private readonly IEnrollmentExpirationService _enrollmentExpirationService;
    private readonly ILogger<RevokeExpiredEnrollmentsCommandHandler> _logger;

    public RevokeExpiredEnrollmentsCommandHandler(
        IEnrollmentExpirationService enrollmentExpirationService,
        ILogger<RevokeExpiredEnrollmentsCommandHandler> logger)
    {
        _enrollmentExpirationService = enrollmentExpirationService;
        _logger = logger;
    }

    public async Task<RevokeExpiredEnrollmentsResult> Handle(RevokeExpiredEnrollmentsCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting revocation of expired enrollments by user {ExecutedBy}", request.ExecutedBy);
        
        var revokedCount = await _enrollmentExpirationService.RevokeExpiredEnrollmentsAsync();
        var academicYear = _enrollmentExpirationService.GetCurrentAcademicYear() - 1;
        
        var result = new RevokeExpiredEnrollmentsResult
        {
            RevokedCount = revokedCount,
            AcademicYear = academicYear,
            ExecutedAt = DateTime.UtcNow,
            ExecutedBy = request.ExecutedBy
        };

        _logger.LogInformation("Revocation completed. {RevokedCount} enrollments revoked from academic year {AcademicYear}", 
            revokedCount, academicYear);
        
        return result;
    }
}
