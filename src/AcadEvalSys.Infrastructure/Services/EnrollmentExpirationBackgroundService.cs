using AcadEvalSys.Application.Services;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Infrastructure.Services;

public class EnrollmentExpirationBackgroundService
{
    private readonly IEnrollmentExpirationService _enrollmentExpirationService;
    private readonly ILogger<EnrollmentExpirationBackgroundService> _logger;

    public EnrollmentExpirationBackgroundService(
        IEnrollmentExpirationService enrollmentExpirationService,
        ILogger<EnrollmentExpirationBackgroundService> logger)
    {
        _enrollmentExpirationService = enrollmentExpirationService;
        _logger = logger;
    }

    /// <summary>
    /// Programa la revocación automática de inscripciones expiradas
    /// Se ejecuta el primer día de cada año a las 2:00 AM
    /// </summary>
    public void ScheduleAutomaticRevocation()
    {
        // Cron: 0 2 1 1 * (segundo minuto hora día mes día-semana)
        // Se ejecuta el 1 de enero a las 2:00 AM
        RecurringJob.AddOrUpdate(
            "revoke-expired-enrollments",
            () => RevokeExpiredEnrollmentsAsync(),
            "0 2 1 1 *"
        );
        
        _logger.LogInformation("Scheduled automatic enrollment revocation for January 1st at 2:00 AM");
    }

    /// <summary>
    /// Método que se ejecuta automáticamente para revocar inscripciones expiradas
    /// </summary>
    public async Task RevokeExpiredEnrollmentsAsync()
    {
        try
        {
            _logger.LogInformation("Starting automatic enrollment revocation process");
            
            var revokedCount = await _enrollmentExpirationService.RevokeExpiredEnrollmentsAsync();
            
            _logger.LogInformation("Automatic enrollment revocation completed. {RevokedCount} enrollments revoked", revokedCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during automatic enrollment revocation");
            throw;
        }
    }
}
