namespace AcadEvalSys.Application.Services;

public interface IEnrollmentExpirationService
{
    /// <summary>
    /// Revoca todas las inscripciones del año anterior
    /// </summary>
    Task<int> RevokeExpiredEnrollmentsAsync();
    
    /// <summary>
    /// Revoca inscripciones de un año específico
    /// </summary>
    Task<int> RevokeEnrollmentsByYearAsync(int academicYear);
    
    /// <summary>
    /// Obtiene el año académico actual
    /// </summary>
    int GetCurrentAcademicYear();
}
