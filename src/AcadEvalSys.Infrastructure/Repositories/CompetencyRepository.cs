using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class CompetencyRepository(ApplicationDbContext dbContext) : ICompetencyRepository
{
    public async Task<IEnumerable<Competency>> GetAllAsync()
    {
        return await dbContext.Competencies
            .Where(c => c.IsActive)
            .Include(c => c.LevelDescriptions!.OrderBy(ld => ld.Level))
            .ToListAsync();
    }

    public async Task<Competency?> GetByIdAsync(Guid id)
    {
        return await dbContext.Competencies
            .Include(c => c.LevelDescriptions!.OrderBy(ld => ld.Level))
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
    }

    public async Task<Guid> CreateAsync(Competency competency)
    {
        var result = dbContext.Competencies.Add(competency);
        await dbContext.SaveChangesAsync();
        return result.Entity.Id;
    }

    public async Task DeleteAsync(Guid id, string userId)
    {
        var competency = await dbContext.Competencies.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
        if (competency != null)
        {
            competency.IsActive = false;
            competency.UpdatedByUserId = userId;
            competency.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    public Task<bool> ExistsByNameAsync(string name)
    {
        return dbContext.Competencies.AnyAsync(c => c.Name == name && c.IsActive);
    }

    public Task<bool> ExistsAsync(Guid id)
    {
        return dbContext.Competencies.AnyAsync(c => c.Id == id && c.IsActive);
    }

    public async Task UpdateAsync(Competency competency)
    {
        dbContext.Competencies.Update(competency);
        await dbContext.SaveChangesAsync();
    }
}