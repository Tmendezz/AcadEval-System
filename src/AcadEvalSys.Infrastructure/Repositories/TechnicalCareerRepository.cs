using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class TechnicalCareerRepository(ApplicationDbContext dbContext) : ITechnicalCareerRepository
{
    public async Task<Guid> Create(TechnicalCareer entity)
    {
        dbContext.TechnicalCareers.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public Task Update()
    => dbContext.SaveChangesAsync();

    public async Task Delete(TechnicalCareer entity)
    {
        dbContext.Update(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<TechnicalCareer>> GetAllCareersAsync()
    {
        var careers = await dbContext.TechnicalCareers
            .Where(t => t.IsActive == true)
            .ToListAsync();
        return careers;
    }

    public async Task<TechnicalCareer?> GetCareerByIdAsync(Guid id)
    {
        var career = await dbContext.TechnicalCareers.FirstOrDefaultAsync(c => c.Id == id);
        return career;
    }
}