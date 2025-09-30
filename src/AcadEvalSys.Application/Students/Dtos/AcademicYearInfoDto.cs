namespace AcadEvalSys.Application.Students.Dtos;

/// <summary>
/// Información sobre el año académico actual y el estado de las inscripciones
/// </summary>
public class AcademicYearInfoDto
{
    /// <summary>
    /// Año académico actual
    /// </summary>
    public int CurrentAcademicYear { get; set; }
    
    /// <summary>
    /// Año académico anterior
    /// </summary>
    public int PreviousAcademicYear { get; set; }
    
    /// <summary>
    /// Fecha actual
    /// </summary>
    public DateTime CurrentDate { get; set; }
    
    /// <summary>
    /// Próxima revocación automática
    /// </summary>
    public DateTime NextAutomaticRevocation { get; set; }
    
    /// <summary>
    /// Descripción de la próxima revocación
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
