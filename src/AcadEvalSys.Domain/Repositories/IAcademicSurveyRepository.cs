using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface IAcademicSurveyRepository
{
    Task<Guid> CreateFromTemplateAsync(string title, Guid templateId, DateTime? publishAt, DateTime? closeAt, string? userId = null, CancellationToken ct = default);
    Task SetSubjectsAsync(Guid surveyId, IEnumerable<Guid> subjectIds, string? userId = null, CancellationToken ct = default);

    Task PublishAsync(Guid surveyId, DateTime? publishAt = null, CancellationToken ct = default);
    Task CloseAsync(Guid surveyId, DateTime? closeAt = null, CancellationToken ct = default);

    Task<AcademicSurvey?> GetByIdAsync(Guid id, bool includeChildren = true, CancellationToken ct = default);
    Task<IReadOnlyList<AcademicSurvey>> ListAsync(
        SurveyStatus? status = null,
        Guid? technicalCareerId = null,
        Guid? subjectId = null,
        string? search = null,
        CancellationToken ct = default);

    Task<bool> ExistsTitleAsync(string title, Guid? excludingId = null, CancellationToken ct = default);
}
