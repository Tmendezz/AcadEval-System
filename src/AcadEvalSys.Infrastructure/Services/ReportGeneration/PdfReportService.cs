using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;
using Microsoft.Extensions.Logging;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Document = QuestPDF.Fluent.Document;

namespace AcadEvalSys.Infrastructure.Services.ReportGeneration;

public class PdfReportService : IReportService
{
    private readonly ILogger<PdfReportService> _logger;
    private readonly ICompetencyEvaluationInstanceRepository _evaluationRepo;
    private readonly IDocumentFactory _documentFactory;

    public PdfReportService(
        ILogger<PdfReportService> logger,
        ICompetencyEvaluationInstanceRepository evaluationRepo,
        IDocumentFactory documentFactory)
    {
        _logger = logger;
        _evaluationRepo = evaluationRepo;
        _documentFactory = documentFactory;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<Stream> GenerateStudentEvaluationSummaryReportAsync(StudentSummaryReportData reportData)
    {
        _logger.LogDebug("Generating detailed PDF summary report for student {StudentName}", reportData.StudentName);

        try
        {
            var document = _documentFactory.CreateStudentSummaryDocument(reportData);
            return await GeneratePdfStreamAsync(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating detailed PDF summary report for student {StudentName}", reportData.StudentName);
            throw;
        }
    }

    public async Task<Stream> GenerateStudentCompetencyReportAsync(StudentCompetencyReportData reportData)
    {
        _logger.LogDebug("Generating PDF report for student {StudentName} - {CompetencyName}", 
            reportData.StudentName, reportData.CompetencyName);

        try
        {
            var document = _documentFactory.CreateStudentCompetencyDocument(reportData);
            return await GeneratePdfStreamAsync(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating PDF report for student {StudentName}", reportData.StudentName);
            throw;
        }
    }

    public async Task<Stream> GenerateEvaluationSummaryReportAsync(Guid evaluationInstanceId)
    {
        _logger.LogDebug("Generating summary report for evaluation instance {EvaluationInstanceId}", evaluationInstanceId);

        try
        {
            var evaluationInstance = await _evaluationRepo.GetByIdAsync(evaluationInstanceId);
            if (evaluationInstance == null)
                throw new ArgumentException($"Evaluation instance {evaluationInstanceId} not found");

            var document = _documentFactory.CreateEvaluationSummaryDocument(evaluationInstance);
            return await GeneratePdfStreamAsync(document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating summary PDF report for evaluation {EvaluationInstanceId}", evaluationInstanceId);
            throw;
        }
    }

    private async Task<Stream> GeneratePdfStreamAsync(Document document)
    {
        var stream = new MemoryStream();
        await Task.Run(() => document.GeneratePdf(stream));
        stream.Position = 0;
        return stream;
    }
}



