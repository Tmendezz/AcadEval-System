using System.ComponentModel;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using IContainer = QuestPDF.Infrastructure.IContainer;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration.Builders;

public interface ITableBuilder
{
    void ComposeCriteriaTable(IContainer container);
    void ComposeCompetenciesTable(IContainer container, ICollection<CompetencyReportDto> competencies);
    void ComposeProfessorEvaluationsTable(IContainer container, ICollection<ProfessorEvaluationDto> evaluations);
}

/// <summary>
/// TableBuilder que implementa el patrón de generación de documentos
/// con separación clara de responsabilidades para la construcción de tablas
/// </summary>
public class TableBuilder : ITableBuilder
{
    private readonly IReportStyleService _styleService;

    public TableBuilder(IReportStyleService styleService)
    {
        _styleService = styleService;
    }

    #region Public Interface Methods

    /// <summary>
    /// Compone la tabla de criterios de evaluación siguiendo el patrón estructurado
    /// </summary>
    public void ComposeCriteriaTable(IContainer container)
    {
        container.Column(column =>
        {
            BuildTableHeader(column, "Criterios de Evaluación");
            BuildCriteriaTableContent(column);
        });
    }

    /// <summary>
    /// Compone la tabla de competencias por materia
    /// </summary>
    public void ComposeCompetenciesTable(IContainer container, ICollection<CompetencyReportDto> competencies)
    {
        container.Column(column =>
        {
            column.Spacing(5);
            BuildTableHeader(column, "Resultados");
            BuildCompetenciesTableContent(column, competencies);
        });
    }

    /// <summary>
    /// Compone la tabla de evaluaciones realizadas por profesores
    /// </summary>
    public void ComposeProfessorEvaluationsTable(IContainer container, ICollection<ProfessorEvaluationDto> evaluations)
    {
        container.Column(column =>
        {
            BuildTableHeader(column, "Resultados");
            BuildProfessorEvaluationsTableContent(column, evaluations);
        });
    }

    #endregion

    #region Table Structure Methods

    /// <summary>
    /// Construye el encabezado común para todas las tablas
    /// </summary>
    private void BuildTableHeader(ColumnDescriptor column, string title)
    {
        column.Item().Text(title).Style(_styleService.SectionTitleStyle);
    }

    /// <summary>
    /// Construye el contenido específico de la tabla de criterios
    /// </summary>
    private void BuildCriteriaTableContent(ColumnDescriptor column)
    {
        column.Item().PaddingTop(5).Table(table =>
        {
            ConfigureCriteriaTableColumns(table);
            AddCriteriaTableHeaders(table);
            AddCriteriaTableRows(table);
        });
    }

    /// <summary>
    /// Construye el contenido específico de la tabla de competencias
    /// </summary>
    private void BuildCompetenciesTableContent(ColumnDescriptor column, ICollection<CompetencyReportDto> competencies)
    {
        column.Item().PaddingTop(5).Table(table =>
        {
            ConfigureCompetenciesTableColumns(table);
            AddCompetenciesTableHeaders(table);
            AddCompetenciesTableRows(table, competencies);
        });
    }

    /// <summary>
    /// Construye el contenido específico de la tabla de evaluaciones de profesores
    /// </summary>
    private void BuildProfessorEvaluationsTableContent(ColumnDescriptor column, ICollection<ProfessorEvaluationDto> evaluations)
    {
        column.Item().PaddingTop(10).Table(table =>
        {
            ConfigureCompetenciesTableColumns(table); // Misma estructura que competencias
            AddCompetenciesTableHeaders(table);
            AddProfessorEvaluationsTableRows(table, evaluations);
        });
    }

    #endregion

    #region Table Configuration Methods

    /// <summary>
    /// Configura las columnas para la tabla de criterios
    /// </summary>
    private void ConfigureCriteriaTableColumns(TableDescriptor table)
    {
        table.ColumnsDefinition(columns =>
        {
            columns.ConstantColumn(100);
            columns.RelativeColumn();
        });
    }

    /// <summary>
    /// Configura las columnas para las tablas de competencias y evaluaciones
    /// </summary>
    private void ConfigureCompetenciesTableColumns(TableDescriptor table)
    {
        table.ColumnsDefinition(columns =>
        {
            columns.RelativeColumn(2f);   // Materia (necesita más espacio para nombres completos)
            columns.RelativeColumn(2f);   // Profesor (nombres completos)
            columns.RelativeColumn(2f);   // Competencia (descripciones más largas)
            columns.RelativeColumn(1.5f);   // Nivel (texto corto: Excelente, Avanzado, etc.)
            columns.RelativeColumn(4f);
        });
    }

    #endregion

    #region Header Building Methods

    /// <summary>
    /// Añade los encabezados para la tabla de criterios
    /// </summary>
    private void AddCriteriaTableHeaders(TableDescriptor table)
    {
        table.Cell().Element(c => CellStyle(c, _styleService.TableHeaderBackgroundColor)).Text("Nivel").Bold().FontSize(10);
        table.Cell().Element(c => CellStyle(c, _styleService.TableHeaderBackgroundColor)).Text("Descripción").Bold().FontSize(10);
    }

    /// <summary>
    /// Añade los encabezados para las tablas de competencias y evaluaciones
    /// </summary>
    private void AddCompetenciesTableHeaders(TableDescriptor table)
    {
        var headers = new[] {   "Asignatura",  "Profesor", "Competencia", "Nivel", "Observación" };
        
        foreach (var title in headers)
        {
            table.Cell()
                .Element(c => CellStyle(c, _styleService.TableHeaderBackgroundColor))
                .Text(title)
                .Style(_styleService.TableHeaderStyle);
        }
    }

    #endregion

    #region Row Building Methods

    /// <summary>
    /// Añade las filas de datos para la tabla de criterios
    /// </summary>
    private void AddCriteriaTableRows(TableDescriptor table)
    {
        var criteria = GetEvaluationCriteria();
        var index = 0;
        
        foreach (var (level, description) in criteria)
        {
            var bgColor = _styleService.GetAlternatingRowColor(index++);
            AddCriteriaTableRow(table, level, description, bgColor);
        }
    }

    /// <summary>
    /// Añade las filas de datos para la tabla de competencias
    /// </summary>
    private void AddCompetenciesTableRows(TableDescriptor table, ICollection<CompetencyReportDto> competencies)
    {
        var index = 0;
        foreach (var competency in competencies)
        {
            var bgColor = _styleService.GetAlternatingRowColor(index++);
            AddCompetencyTableRow(table, competency, bgColor);
        }
    }

    /// <summary>
    /// Añade las filas de datos para la tabla de evaluaciones de profesores
    /// </summary>
    private void AddProfessorEvaluationsTableRows(TableDescriptor table, ICollection<ProfessorEvaluationDto> evaluations)
    {
        var index = 0;
        foreach (var evaluation in evaluations)
        {
            var bgColor = _styleService.GetProfessorEvaluationRowColor(index++);
            AddProfessorEvaluationTableRow(table, evaluation, bgColor);
        }
    }

    #endregion

    #region Individual Row Methods

    /// <summary>
    /// Añade una fila individual para la tabla de criterios
    /// </summary>
    private void AddCriteriaTableRow(TableDescriptor table, string level, string description, string bgColor)
    {
        table.Cell().Element(c => CellStyle(c, bgColor)).Text(level).Bold().FontSize(10);
        table.Cell().Element(c => CellStyle(c, bgColor)).Text(description).FontSize(10);
    }

    /// <summary>
    /// Añade una fila individual para la tabla de competencias
    /// </summary>
    private void AddCompetencyTableRow(TableDescriptor table, CompetencyReportDto competency, string bgColor)
    {
      
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(competency.Subject).FontSize(10);
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(competency.Professor).FontSize(10);
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(competency.Name).FontSize(10);
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(competency.CompetencyLevel.HasValue
                ? _styleService.GetCompetencyLevelDescription(competency.CompetencyLevel.Value)
                : "Sin calificar")
            .FontSize(10)
            .SemiBold();
            
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(competency.Description).FontSize(10).WrapAnywhere();
    }

    /// <summary>
    /// Añade una fila individual para la tabla de evaluaciones de profesores
    /// </summary>
    private void AddProfessorEvaluationTableRow(TableDescriptor table, ProfessorEvaluationDto evaluation, string bgColor)
    {
  
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(evaluation.SubjectName).FontSize(10);
            
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(evaluation.ProfessorName).FontSize(10);
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(evaluation.CompetencyName).FontSize(10);
            
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(_styleService.GetCompetencyLevelDescription(evaluation.Level))
            .FontSize(10)
            .SemiBold();
        
        table.Cell().Element(c => CellStyle(c, bgColor))
            .Text(evaluation.Description).FontSize(10).WrapAnywhere();
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Obtiene los criterios de evaluación estáticos
    /// </summary>
    private static (string Level, string Description)[] GetEvaluationCriteria()
    {
        return new[]
        {
            ("Excelente", "Domina completamente la competencia, aplicándola de manera ejemplar y consistente en cualquier contexto."),
            ("Avanzado", "Muestra un dominio sólido de la competencia, aplicándola de forma autónoma en la mayoría de las situaciones."),
            ("Intermedio", "Demuestra la competencia de manera parcial, con áreas de mejora identificables."),
            ("Inicial", "Requiere desarrollo y práctica adicional para alcanzar un nivel competente.")
        };
    }

    /// <summary>
    /// Aplica el estilo común a las celdas de la tabla usando colores centralizados
    /// con centrado vertical y horizontal del contenido
    /// </summary>
    private IContainer CellStyle(IContainer container, string backgroundColor)
        => container
            .Background(backgroundColor)
            .Border(1)
            .BorderColor(_styleService.BorderColor)
            .Padding(6)
            .AlignCenter()        // Centrado horizontal
            .AlignMiddle();       // Centrado vertical

    #endregion
}
