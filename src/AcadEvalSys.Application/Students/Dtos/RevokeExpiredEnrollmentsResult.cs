namespace AcadEvalSys.Application.Students.Dtos;

/// <summary>
/// Resultado de la operación de revocación de inscripciones
/// </summary>
public class RevokeExpiredEnrollmentsResult
{
    /// <summary>
    /// Número de inscripciones revocadas
    /// </summary>
    public int RevokedCount { get; set; }
    
    /// <summary>
    /// Año académico del cual se revocaron las inscripciones
    /// </summary>
    public int AcademicYear { get; set; }
    
    /// <summary>
    /// Fecha y hora de ejecución
    /// </summary>
    public DateTime ExecutedAt { get; set; }
    
    /// <summary>
    /// Usuario que ejecutó la operación
    /// </summary>
    public string ExecutedBy { get; set; } = string.Empty;
}
