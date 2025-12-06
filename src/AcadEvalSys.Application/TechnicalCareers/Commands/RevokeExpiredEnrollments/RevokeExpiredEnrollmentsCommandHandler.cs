using AcadEvalSys.Application.Services;
using AcadEvalSys.Application.Students.Dtos;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.RevokeExpiredEnrollments;

public class RevokeExpiredEnrollmentsCommandHandler(
    IEnrollmentExpirationService enrollmentExpirationService,
    ILogger<RevokeExpiredEnrollmentsCommandHandler> logger) : IRequestHandler<RevokeExpiredEnrollmentsCommand, RevokeExpiredEnrollmentsResult>
{
    public async Task<RevokeExpiredEnrollmentsResult> Handle(RevokeExpiredEnrollmentsCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Revoking expired enrollments. Specific year: {SpecificYear}", request.SpecificYear);

        int academicYear;
        int revokedCount;

        if (request.SpecificYear.HasValue)
        {
            academicYear = request.SpecificYear.Value;
            revokedCount = await enrollmentExpirationService.RevokeEnrollmentsByYearAsync(academicYear);
        }
        else
        {
            revokedCount = await enrollmentExpirationService.RevokeExpiredEnrollmentsAsync();
            academicYear = enrollmentExpirationService.GetCurrentAcademicYear() - 1;
        }

        var result = new RevokeExpiredEnrollmentsResult
        {
            RevokedCount = revokedCount,
            AcademicYear = academicYear,
            ExecutedAt = DateTime.UtcNow,
            ExecutedBy = "System" // Para comandos automáticos
        };

        logger.LogInformation("Successfully revoked {RevokedCount} enrollments from academic year {AcademicYear}", 
            result.RevokedCount, result.AcademicYear);

        return result;
    }
}
