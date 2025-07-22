using AcadEvalSys.Domain.Enums;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;

public interface IReportStyleService
{
    // Estilos de texto existentes
    TextStyle TitleStyle { get; }
    TextStyle SubtitleStyle { get; }
    TextStyle HeaderTextStyle { get; }
    TextStyle NormalTextStyle { get; }
    TextStyle TableHeaderStyle { get; }
    TextStyle SectionTitleStyle { get; }
    
    // Nuevos estilos para centralizar
    TextStyle StudentDetailStyle { get; }
    TextStyle StudentDetailLabelStyle { get; }
    TextStyle SignatureSectionStyle { get; }
    TextStyle CommentsHeaderStyle { get; }
    TextStyle CommentsTextStyle { get; }
    
    // Colores centralizados
    string TableHeaderBackgroundColor { get; }
    string AlternatingRowColor1 { get; }
    string AlternatingRowColor2 { get; }
    string ProfessorEvaluationRowColor1 { get; }
    string ProfessorEvaluationRowColor2 { get; }
    string BorderColor { get; }
    string SeparatorLineColor { get; }
    
    // Métodos existentes
    string GetCompetencyLevelDescription(CompetencyLevel level);
    
    // Nuevos métodos helper
    string GetAlternatingRowColor(int index);
    string GetProfessorEvaluationRowColor(int index);
}

/// <summary>
/// Servicio centralizado de estilos para reportes PDF
/// Implementa el patrón de centralización de responsabilidades de styling
/// </summary>
public class ReportStyleService : IReportStyleService
{
    #region Estilos de Texto

    // Estilos existentes
    public TextStyle TitleStyle { get; } = TextStyle.Default.FontSize(16).SemiBold().FontColor(Colors.Grey.Darken4);
    public TextStyle SubtitleStyle { get; } = TextStyle.Default.FontSize(14).SemiBold().FontColor(Colors.Grey.Darken2);
    public TextStyle HeaderTextStyle { get; } = TextStyle.Default.FontSize(9).FontColor(Colors.Grey.Darken2);
    public TextStyle NormalTextStyle { get; } = TextStyle.Default.FontSize(9);
    public TextStyle TableHeaderStyle { get; } = TextStyle.Default.FontSize(10).SemiBold().FontColor(Colors.Grey.Darken3);
    public TextStyle SectionTitleStyle { get; } = TextStyle.Default.FontSize(12).SemiBold().FontColor(Colors.Grey.Darken4);
    
    // Nuevos estilos centralizados
    public TextStyle StudentDetailStyle { get; } = TextStyle.Default.FontSize(9);
    public TextStyle StudentDetailLabelStyle { get; } = TextStyle.Default.FontSize(9).SemiBold();
    public TextStyle SignatureSectionStyle { get; } = TextStyle.Default.FontSize(9).FontColor(Colors.Grey.Darken2);
    public TextStyle CommentsHeaderStyle { get; } = TextStyle.Default.FontSize(14).SemiBold();
    public TextStyle CommentsTextStyle { get; } = TextStyle.Default.FontSize(11).Italic();

    #endregion

    #region Colores Centralizados

    // Colores para tablas y componentes
    public string TableHeaderBackgroundColor { get; } = Colors.Grey.Lighten3;
    public string AlternatingRowColor1 { get; } = Colors.White;
    public string AlternatingRowColor2 { get; } = Colors.Grey.Lighten5;
    public string ProfessorEvaluationRowColor1 { get; } = Colors.White;
    public string ProfessorEvaluationRowColor2 { get; } = Colors.BlueGrey.Lighten5;
    public string BorderColor { get; } = Colors.Grey.Darken2;
    public string SeparatorLineColor { get; } = Colors.Grey.Lighten2;

    #endregion

    #region Métodos Helper de Colores

    /// <summary>
    /// Obtiene el color de fondo alternado para filas de tabla
    /// </summary>
    /// <param name="index">Índice de la fila</param>
    /// <returns>Color de fondo correspondiente</returns>
    public string GetAlternatingRowColor(int index)
        => index % 2 == 0 ? AlternatingRowColor1 : AlternatingRowColor2;
        
    /// <summary>
    /// Obtiene el color de fondo específico para evaluaciones de profesores
    /// </summary>
    /// <param name="index">Índice de la fila</param>
    /// <returns>Color de fondo correspondiente</returns>
    public string GetProfessorEvaluationRowColor(int index)
        => index % 2 == 0 ? ProfessorEvaluationRowColor1 : ProfessorEvaluationRowColor2;

    #endregion

    #region Métodos de Competencias

    /// <summary>
    /// Obtiene la descripción textual del nivel de competencia
    /// </summary>
    /// <param name="level">Nivel de competencia</param>
    /// <returns>Descripción del nivel</returns>
    public string GetCompetencyLevelDescription(CompetencyLevel level) => level switch
    {
        CompetencyLevel.Inicial => "Inicial",
        CompetencyLevel.Intermedio => "Intermedio",
        CompetencyLevel.Avanzado => "Avanzado",
        CompetencyLevel.Excelente => "Excelente",
        _ => "No Evaluado"
    };

    #endregion
}