using System.Threading.Tasks;
using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface ICoordinatorRepository
{
    Task<Coordinator?> GetByUserIdAsync(string userId);
    Task<Coordinator?> GetByCareerIdAsync(Guid technicalCareerId);
    Task RemoveByCareerIdAsync(Guid technicalCareerId);
    Task AddAsync(Coordinator coordinator);
}
