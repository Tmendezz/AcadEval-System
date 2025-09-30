using System.Threading.Tasks;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class CoordinatorRepository(ApplicationDbContext dbContext) : ICoordinatorRepository
{
    public Task<Coordinator?> GetByUserIdAsync(string userId)
        => dbContext.Coordinators.FirstOrDefaultAsync(c => c.UserId == userId);

    public Task<Coordinator?> GetByCareerIdAsync(Guid technicalCareerId)
        => dbContext.Coordinators
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.TechnicalCareerId == technicalCareerId);

    public async Task RemoveByCareerIdAsync(Guid technicalCareerId)
    {
        var existing = await dbContext.Coordinators.FirstOrDefaultAsync(c => c.TechnicalCareerId == technicalCareerId);
        if (existing is not null)
        {
            dbContext.Coordinators.Remove(existing);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task AddAsync(Coordinator coordinator)
    {
        dbContext.Coordinators.Add(coordinator);
        await dbContext.SaveChangesAsync();
    }
}
