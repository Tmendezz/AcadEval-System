using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace AcadEvalSys.Infrastructure.Services.ReportGeneration.Builders;

public interface IContentBuilder
{
    void ComposeStudentDetailsSection(IContainer container, StudentSummaryReportData reportData);
    void ComposeDetailedContent(IContainer container, StudentSummaryReportData reportData);
    void ComposeOriginalContent(IContainer container, StudentCompetencyReportData reportData);
    void ComposeSummaryContent(IContainer container, Domain.Entities.CompetencyEvaluationInstance evaluationInstance);
}

public class ContentBuilder : IContentBuilder
{
    private readonly ITableBuilder _tableBuilder;
    private readonly IReportStyleService _styleService;

    public ContentBuilder(ITableBuilder tableBuilder, IReportStyleService styleService)
    {
        _tableBuilder = tableBuilder;
        _styleService = styleService;
    }

    public void ComposeStudentDetailsSection(IContainer container, StudentSummaryReportData reportData)
    {
        container.PaddingTop(15).Row(row =>
        {
            row.RelativeItem(2).AlignLeft().Text(text =>
            {
                text.Span("Estudiante: ").SemiBold().FontSize(9);
                text.Span(reportData.StudentName).FontSize(9);
            });
            row.RelativeItem(3).AlignCenter().Text(text =>
            {
                text.Span("Tecnicatura: ").SemiBold().FontSize(9);
                text.Span(reportData.CareerName).FontSize(9);
            });
            row.RelativeItem(1.5f).AlignRight().Text(text =>
            {
                text.Span("Fecha: ").SemiBold().FontSize(9);
                text.Span($"{reportData.GeneratedDate:dd/MM/yyyy}").FontSize(9);
            });
        });
    }

    public void ComposeDetailedContent(IContainer container, StudentSummaryReportData reportData)
    {
        container.PaddingVertical(20).Column(column =>
        {
            column.Spacing(30);
            column.Item().Element(c => ComposeStudentDetailsSection(c, reportData));
            column.Item().Element(c => _tableBuilder.ComposeCompetenciesTable(c, reportData.Competencies));
            column.Item().Element(ComposeSignatureSection);
        });
    }

    public void ComposeOriginalContent(IContainer container, StudentCompetencyReportData reportData)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(15);
            column.Item().Element(c => ComposeStudentInfo(c, reportData));
            column.Item().Element(c => ComposeEvaluationInfo(c, reportData));

            if (reportData.ProfessorEvaluations?.Any() == true)
            {
                column.Item().Element(c => _tableBuilder.ComposeProfessorEvaluationsTable(c, reportData.ProfessorEvaluations));
            }

            if (!string.IsNullOrWhiteSpace(reportData.Comments))
            {
                column.Item().Element(c => ComposeComments(c, reportData.Comments));
            }
        });
    }

    public void ComposeSummaryContent(IContainer container, Domain.Entities.CompetencyEvaluationInstance evaluationInstance)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(15);
            column.Item().Text($"Resumen de Evaluación: {evaluationInstance.Title}").Style(TextStyle.Default.FontSize(16).SemiBold());
            column.Item().Text($"Período: {evaluationInstance.PeriodFrom:dd/MM/yyyy} - {evaluationInstance.PeriodTo:dd/MM/yyyy}").FontSize(12);

            var totalAssignments = evaluationInstance.ProfessorCompetencyAssignments?.Count ?? 0;
            var completedAssignments = evaluationInstance.ProfessorCompetencyAssignments?.Count(pca => pca.Status == ProfessorAssignmentStatus.Completed) ?? 0;
            column.Item().Text($"Asignaciones Completadas: {completedAssignments}/{totalAssignments}").FontSize(12);
        });
    }

    private void ComposeStudentInfo(IContainer container, StudentCompetencyReportData reportData)
    {
        container.Column(column =>
        {
            column.Item().Text("Información del Estudiante").Style(TextStyle.Default.FontSize(14).SemiBold());
            column.Item().PaddingTop(10).Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Nombre: {reportData.StudentName}").FontSize(12);
                    col.Item().Text($"ID Estudiante: {reportData.StudentId}").FontSize(10).FontColor(Colors.Grey.Darken1);
                });
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Carrera Técnica: {reportData.TechnicalCareerName}").FontSize(12);
                    col.Item().Text($"Profesor Evaluador: {reportData.ProfessorName}").FontSize(12);
                });
            });
        });
    }

    private void ComposeEvaluationInfo(IContainer container, StudentCompetencyReportData reportData)
    {
        container.Column(column =>
        {
            column.Item().Text("Información de la Evaluación").Style(TextStyle.Default.FontSize(14).SemiBold());
            column.Item().PaddingTop(10).Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Período de Evaluación: {reportData.EvaluationPeriod}").FontSize(12);
                    col.Item().Text($"Competencia Evaluada: {reportData.CompetencyName}").FontSize(12);
                });
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"Fecha de Evaluación: {reportData.EvaluationDate:dd/MM/yyyy}").FontSize(12);
                });
            });
        });
    }

    private void ComposeSignatureSection(IContainer container)
    {
        container.PaddingTop(100).Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().LineHorizontal(1).LineColor(Colors.Grey.Medium);
                column.Item().PaddingTop(5).AlignCenter().Text("Coordinador Académico").Style(_styleService.HeaderTextStyle);
            });
            row.ConstantItem(100);
            row.RelativeItem().Column(column =>
            {
                column.Item().LineHorizontal(1).LineColor(Colors.Grey.Medium);
                column.Item().PaddingTop(5).AlignCenter().Text("Secretaría Académica").Style(_styleService.HeaderTextStyle);
            });
        });
    }

    private void ComposeComments(IContainer container, string comments)
    {
        container.Column(column =>
        {
            column.Item().Text("Comentarios del Evaluador").Style(TextStyle.Default.FontSize(14).SemiBold());
            column.Item().PaddingTop(10).BorderLeft(3).BorderColor(Colors.Blue.Lighten2).PaddingLeft(15).Text(comments).FontSize(11).Italic();
        });
    }
}