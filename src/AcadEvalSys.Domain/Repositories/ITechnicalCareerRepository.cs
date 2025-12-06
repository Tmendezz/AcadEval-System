using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface ITechnicalCareerRepository
{
    Task<Guid> Create(TechnicalCareer entity);
    Task Update(TechnicalCareer entity);
    Task Delete(TechnicalCareer entity);

    Task<IEnumerable<TechnicalCareer>> GetAllCareersAsync();
    Task<TechnicalCareer?> GetCareerByIdAsync(Guid id);
}