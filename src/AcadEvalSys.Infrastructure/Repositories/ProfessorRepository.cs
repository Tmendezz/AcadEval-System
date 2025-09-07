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
            .FirstOrDefaultAsync(p => p.UserId == professorId && p.User!.IsActive);
    }

    public async Task<(IEnumerable<Professor> Professors, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, Guid? technicalCareerId = null)
    {
        var query = dbContext.Professors
            .Include(p => p.User)
            .Include(p => p.Subjects!)
                .ThenInclude(s => s.TechnicalCareer)
            .Where(p => p.User!.IsActive) // Solo usuarios activos
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(p => p.User!.Name.Contains(searchTerm) || 
                                   p.User!.Email!.Contains(searchTerm));
        }

        if (technicalCareerId.HasValue)
        {
            query = query.Where(p => p.Subjects!.Any(s => s.TechnicalCareerId == technicalCareerId && s.IsActive));
        }

        var totalCount = await query.CountAsync();
        
        var professors = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (professors, totalCount);
    }

    public async Task CreateAsync(Professor professor)
    {
        dbContext.Professors.Add(professor);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Professor professor)
    {
        dbContext.Professors.Update(professor);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(string professorId)
    {
        var professor = await dbContext.Professors.FirstOrDefaultAsync(p => p.UserId == professorId);
        if (professor != null)
        {
            // Borrado físico - las entidades Professor no tienen IsActive
            dbContext.Professors.Remove(professor);
            await dbContext.SaveChangesAsync();
        }
    }
}