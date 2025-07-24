using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class ProfessorRepository(ApplicationDbContext dbContext) : IProfessorRepository
{
    public async Task<Professor?> GetByIdAsync(string professorId)
    {
        return await dbContext.Professors
            .Include(p => p.User)
            .Include(p => p.Subjects!)
                .ThenInclude(s => s.TechnicalCareer)
            .FirstOrDefaultAsync(p => p.UserId == professorId);
    }

    public async Task<bool> ExistsAsync(string professorId)
    {
        return await dbContext.Professors.AnyAsync(p => p.UserId == professorId);
    }

    public async Task<IEnumerable<Professor>> GetAllAsync()
    {
        return await dbContext.Professors
            .Include(p => p.User)
            .Include(p => p.Subjects!)
                .ThenInclude(s => s.TechnicalCareer)
            .ToListAsync();
    }

    public async Task<IEnumerable<Subject>> GetSubjectsByProfessorAsync(string professorId)
    {
        return await dbContext.Subjects
            .Include(s => s.TechnicalCareer)
            .Include(s => s.Professor!)
                .ThenInclude(p => p.User)
            .Where(s => s.ProfessorId == professorId && s.IsActive)
            .ToListAsync();
    }
}