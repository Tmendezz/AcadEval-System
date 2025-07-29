using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface ICompetencyEvaluationInstanceRepository
{
    Task<Guid> CreateAsync(CompetencyEvaluationInstance instance);
    Task<CompetencyEvaluationInstance?> GetByIdAsync(Guid id);
    Task<IEnumerable<CompetencyEvaluationInstance>> GetAllAsync();
    Task UpdateAsync(CompetencyEvaluationInstance instance);
    Task DeleteAsync(Guid id);
    Task<CompetencyEvaluationInstance?> GetForReportGenerationAsync(Guid id);
}
