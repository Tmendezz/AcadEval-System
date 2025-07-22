using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface ITechnicalCareerRepository
{
    Task<Guid> Create(TechnicalCareer entity);
    Task Update();
    Task Delete(TechnicalCareer entity);

    Task<IEnumerable<TechnicalCareer>> GetAllCareersAsync();
    Task<TechnicalCareer?> GetCareerByIdAsync(Guid id);
    Task<IEnumerable<TechnicalCareer>> GetCareersByIdsAsync(IEnumerable<Guid> ids);
}