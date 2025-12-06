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
        // Lógica ajustada para el calendario académico argentino
        // El año académico empieza en marzo y termina en febrero del año siguiente
        var now = DateTime.Now;
        
        // Si estamos entre marzo y diciembre, el año académico es el año actual
        // Si estamos entre enero y febrero, el año académico es el año anterior
        return now.Month >= 3 ? now.Year : now.Year - 1;
    }

    public async Task<int> RevokeExpiredEnrollmentsAsync()
    {
        var currentYear = GetCurrentAcademicYear();
        var previousYear = currentYear - 1;
        
        _logger.LogInformation("Starting automatic revocation of enrollments from academic year {PreviousYear}", previousYear);
        
        return await RevokeEnrollmentsByYearAsync(previousYear);
    }

    public async Task<int> RevokeEnrollmentsByYearAsync(int academicYear)
    {
        _logger.LogInformation("Revoking enrollments from academic year {AcademicYear}", academicYear);
        
        // Validar que el año no sea futuro
        var currentYear = GetCurrentAcademicYear();
        if (academicYear >= currentYear)
        {
            _logger.LogWarning("Cannot revoke enrollments for current or future academic year {AcademicYear}. Current year is {CurrentYear}", 
                academicYear, currentYear);
            return 0;
        }
        
        // Validar que el año no sea demasiado antiguo (más de 5 años)
        if (academicYear < currentYear - 5)
        {
            _logger.LogWarning("Academic year {AcademicYear} is too old (more than 5 years ago). Skipping revocation.", academicYear);
            return 0;
        }
        
        var revokedCount = await _studentRepository.RevokeEnrollmentsByYearAsync(academicYear);
        
        _logger.LogInformation("Successfully revoked {Count} enrollments from academic year {AcademicYear}", revokedCount, academicYear);
        return revokedCount;
    }
}
