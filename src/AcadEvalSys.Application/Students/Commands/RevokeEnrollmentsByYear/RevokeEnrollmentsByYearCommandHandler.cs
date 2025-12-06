using AcadEvalSys.Application.Services;
using AcadEvalSys.Application.Students.Dtos;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Commands.RevokeEnrollmentsByYear;

/// <summary>
/// Handler para revocar inscripciones de un año académico específico
/// </summary>
public class RevokeEnrollmentsByYearCommandHandler : IRequestHandler<RevokeEnrollmentsByYearCommand, RevokeExpiredEnrollmentsResult>
{
    private readonly IEnrollmentExpirationService _enrollmentExpirationService;
    private readonly ILogger<RevokeEnrollmentsByYearCommandHandler> _logger;

    public RevokeEnrollmentsByYearCommandHandler(
        IEnrollmentExpirationService enrollmentExpirationService,
        ILogger<RevokeEnrollmentsByYearCommandHandler> logger)
    {
        _enrollmentExpirationService = enrollmentExpirationService;
        _logger = logger;
    }

    public async Task<RevokeExpiredEnrollmentsResult> Handle(RevokeEnrollmentsByYearCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting revocation of enrollments for academic year {AcademicYear} by user {ExecutedBy}", 
            request.AcademicYear, request.ExecutedBy);
        
        var revokedCount = await _enrollmentExpirationService.RevokeEnrollmentsByYearAsync(request.AcademicYear);
        
        var result = new RevokeExpiredEnrollmentsResult
        {
            RevokedCount = revokedCount,
            AcademicYear = request.AcademicYear,
            ExecutedAt = DateTime.UtcNow,
            ExecutedBy = request.ExecutedBy
        };

        _logger.LogInformation("Revocation by year completed. {RevokedCount} enrollments revoked from academic year {AcademicYear}", 
            revokedCount, request.AcademicYear);
        
        return result;
    }
}
