using System.Threading.Tasks;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class CoordinatorRepository(ApplicationDbContext dbContext) : ICoordinatorRepository
{
    public async Task<Coordinator?> GetByUserIdAsync(string userId)
    {
        return await dbContext.Coordinators
            .AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.TechnicalCareer)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<Coordinator?> GetByCareerIdAsync(Guid technicalCareerId)
    {
        return await dbContext.Coordinators
            .AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.TechnicalCareer)
            .FirstOrDefaultAsync(c => c.TechnicalCareerId == technicalCareerId);
    }

    public async Task RemoveByCareerIdAsync(Guid technicalCareerId)
    {
        var toRemove = await dbContext.Coordinators
            .Where(c => c.TechnicalCareerId == technicalCareerId)
            .ToListAsync();

        if (toRemove.Count == 0) return;

        dbContext.Coordinators.RemoveRange(toRemove);
        await dbContext.SaveChangesAsync();
    }

    public async Task AddAsync(Coordinator coordinator)
    {
        dbContext.Coordinators.Add(coordinator);
        await dbContext.SaveChangesAsync();
    }
}
