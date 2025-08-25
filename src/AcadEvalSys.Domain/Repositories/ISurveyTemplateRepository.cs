using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories
{
    public interface ISurveyTemplateRepository
    {
        Task<Guid> CreateAsync(SurveyTemplate template, CancellationToken ct = default);
        Task UpdateAsync(SurveyTemplate template, CancellationToken ct = default);
        Task SoftDeleteAsync(Guid id, CancellationToken ct = default);

        Task<IReadOnlyList<SurveyTemplate>> ListAsync(
        bool? isDraft = null,
        string? search = null,
        SurveyTemplateType? type = null,
        CancellationToken ct = default);
        Task<SurveyTemplate?> GetTemplateByIdAsync(Guid id, bool includeChildren = true, CancellationToken ct = default);
    }
}
