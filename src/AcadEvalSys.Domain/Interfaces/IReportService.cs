using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Interfaces;

public interface IReportService
{
    /// <summary>
    /// Generates a PDF report for a student's competency assessment
    /// </summary>
    /// <param name="reportData">Data needed to generate the report</param>
    /// <returns>Stream containing the generated PDF</returns>
    Task<Stream> GenerateStudentCompetencyReportAsync(StudentCompetencyReportData reportData);
    
    /// <summary>
    /// Generates a summary PDF report for an entire evaluation period
    /// </summary>
    /// <param name="evaluationInstanceId">ID of the evaluation instance</param>
    /// <returns>Stream containing the generated PDF</returns>
    Task<Stream> GenerateEvaluationSummaryReportAsync(Guid evaluationInstanceId);
    
    /// <summary>
    /// Generates a summary PDF report for a specific student's completed evaluations
    /// </summary>
    /// <param name="reportData">Data needed to generate the student summary report</param>
    /// <returns>Stream containing the generated PDF</returns>
    Task<Stream> GenerateStudentEvaluationSummaryReportAsync(StudentSummaryReportData reportData);
}

public class StudentCompetencyReportData
{
    public string StudentName { get; set; } = null!;
    public string? StudentId { get; set; }
    public string CompetencyName { get; set; } = null!;
    public string EvaluationPeriod { get; set; } = null!;
    public DateTime EvaluationDate { get; set; }
    public Enums.CompetencyLevel CompetencyLevel { get; set; }
    public string? Comments { get; set; }
    public string ProfessorName { get; set; } = null!;
    public string TechnicalCareerName { get; set; } = null!;
    
    // Nueva propiedad para múltiples evaluaciones en formato tabla
    public ICollection<ProfessorEvaluationDto> ProfessorEvaluations { get; set; } = new List<ProfessorEvaluationDto>();
}

/// <summary>
/// DTO para el detalle de evaluaciones realizadas por profesores
/// </summary>
public class ProfessorEvaluationDto
{
    public string CompetencyName { get; set; } = string.Empty;
    public Enums.CompetencyLevel Level { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class StudentSummaryReportData
{
    public string StudentName { get; set; } = null!;
    public string CareerName { get; set; } = null!;
    public DateTime GeneratedDate { get; set; }
    public ICollection<CompetencyReportDto> Competencies { get; set; } = new List<CompetencyReportDto>();
}

/// <summary>
/// DTO para las competencias evaluadas en el reporte de resumen del estudiante
/// </summary>
public class CompetencyReportDto
{
    public string Name { get; set; } = string.Empty;
    public CompetencyLevel CompetencyLevel { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Professor { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
