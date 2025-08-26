using AcadEvalSys.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Services;

public class EnrollmentExpirationService : IEnrollmentExpirationService
{
    private readonly IStudentRepository _studentRepository;
    private readonly ILogger<EnrollmentExpirationService> _logger;

    public EnrollmentExpirationService(
        IStudentRepository studentRepository,
        ILogger<EnrollmentExpirationService> logger)
    {
        _studentRepository = studentRepository;
        _logger = logger;
    }

    public int GetCurrentAcademicYear()
    {
        // Puedes ajustar esta lógica según tu calendario académico
        // Por ejemplo, si el año académico empieza en marzo
        var now = DateTime.Now;
        return now.Month >= 3 ? now.Year : now.Year - 1;
    }

    public async Task<int> RevokeExpiredEnrollmentsAsync()
    {
        var currentYear = GetCurrentAcademicYear();
        var previousYear = currentYear - 1;
        
        _logger.LogInformation("Revoking enrollments from academic year {PreviousYear}", previousYear);
        
        return await RevokeEnrollmentsByYearAsync(previousYear);
    }

    public async Task<int> RevokeEnrollmentsByYearAsync(int academicYear)
    {
        _logger.LogInformation("Revoking enrollments from academic year {AcademicYear}", academicYear);
        
        var revokedCount = await _studentRepository.RevokeEnrollmentsByYearAsync(academicYear);
        
        _logger.LogInformation("Successfully revoked {Count} enrollments from academic year {AcademicYear}", revokedCount, academicYear);
        return revokedCount;
    }
}
