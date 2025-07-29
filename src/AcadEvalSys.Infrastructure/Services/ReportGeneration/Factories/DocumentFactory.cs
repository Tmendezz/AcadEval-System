using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Builders;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Document = QuestPDF.Fluent.Document;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;

public interface IDocumentFactory
{
    Document CreateStudentSummaryDocument(StudentSummaryReportData reportData);
    Document CreateStudentCompetencyDocument(StudentCompetencyReportData reportData);
    Document CreateEvaluationSummaryDocument(Domain.Entities.CompetencyEvaluationInstance evaluationInstance);
}

public class DocumentFactory(
    IHeaderBuilder headerBuilder,
    IContentBuilder contentBuilder,
    IReportStyleService styleService)
    : IDocumentFactory
{
    public Document CreateStudentSummaryDocument(StudentSummaryReportData reportData)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.8f, Unit.Centimetre);
                page.DefaultTextStyle(styleService.NormalTextStyle);

                page.Header().Element(c => headerBuilder.ComposeDetailedHeader(c, reportData));
                page.Content().Element(c => contentBuilder.ComposeDetailedContent(c, reportData));
                page.Footer().Element(ComposeFooter);
            });
        });
    }

    public Document CreateStudentCompetencyDocument(StudentCompetencyReportData reportData)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(11));
                
                page.Header().Element(headerBuilder.ComposeOriginalHeader);
                page.Content().Element(content => contentBuilder.ComposeOriginalContent(content, reportData));
                page.Footer().Element(ComposeFooter);
            });
        });
    }

    public Document CreateEvaluationSummaryDocument(Domain.Entities.CompetencyEvaluationInstance evaluationInstance)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(11));
                
                page.Header().Element(headerBuilder.ComposeOriginalHeader);
                page.Content().Element(content => contentBuilder.ComposeSummaryContent(content, evaluationInstance));
                page.Footer().Element(ComposeFooter);
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(text =>
        {
            text.DefaultTextStyle(TextStyle.Default.FontSize(8).FontColor(Colors.Grey.Darken1));
            text.CurrentPageNumber();
            text.Span(" / ");
            text.TotalPages();
        });
    }
}