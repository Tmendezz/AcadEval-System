using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface ICompetencyRepository
{
    Task<IEnumerable<Competency>> GetAllAsync();
    Task<Competency?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(Competency competency);
    Task UpdateAsync(Competency competency);
    Task DeleteAsync(Guid id, string userId);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsAsync(Guid id);
}
