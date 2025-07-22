using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration.Builders;

public interface IHeaderBuilder
{
    void ComposeDetailedHeader(IContainer container, StudentSummaryReportData reportData);
    void ComposeOriginalHeader(IContainer container);
}

public class HeaderBuilder(IReportStyleService styleService, IImageService imageService)
    : IHeaderBuilder
{
    public void ComposeDetailedHeader(IContainer container, StudentSummaryReportData reportData)
    {
        container.Column(column =>
        {
            column.Spacing(5);
            column.Item()
                .AlignCenter()
                .Width(180)
                .Height(60)
                .Image(imageService.LoadImage("logo.png"))
                .FitArea();
            column.Item().AlignCenter().Text("Evaluación de Competencias Blandas").Style(styleService.SubtitleStyle);
            column.Item().PaddingTop(20).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
        });
    }

    public void ComposeOriginalHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("Sistema de Evaluación de Competencias").Style(TextStyle.Default.FontSize(20).SemiBold().FontColor(Colors.Blue.Medium));
                column.Item().Text("Reporte de Competencias Académicas").Style(TextStyle.Default.FontSize(12).FontColor(Colors.Grey.Darken2));
            });
            row.ConstantItem(100).Height(50).Placeholder();
        });
    }
}
