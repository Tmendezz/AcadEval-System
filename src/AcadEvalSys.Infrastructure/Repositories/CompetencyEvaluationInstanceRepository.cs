using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class CompetencyEvaluationInstanceRepository(ApplicationDbContext dbContext) : ICompetencyEvaluationInstanceRepository
{
    public async Task<Guid> CreateAsync(CompetencyEvaluationInstance instance)
    {
        var result = dbContext.CompetencyEvaluationInstances.Add(instance);
        await dbContext.SaveChangesAsync();
        return result.Entity.Id;
    }

    public Task<CompetencyEvaluationInstance?> GetByIdAsync(Guid id)
    {
        var competencyEvaluationInstance = dbContext.CompetencyEvaluationInstances
            .Include(ep => ep.TechnicalCareers)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Competency)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.Professor)
                        .ThenInclude(p => p.User)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.TechnicalCareer)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.StudentCompetencyAssessments)
                    .ThenInclude(sca => sca.Student)
                        .ThenInclude(s => s.User)
            .Include(ep => ep.StudentEvaluationReports)
            .AsSplitQuery()
            .FirstOrDefaultAsync(ep => ep.Id == id && ep.IsActive);
        return competencyEvaluationInstance;
    }

    public async Task<IEnumerable<CompetencyEvaluationInstance>> GetAllAsync()
    {
        return await dbContext.CompetencyEvaluationInstances
            .Include(ep => ep.TechnicalCareers)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Competency)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.Professor)
                        .ThenInclude(p => p.User)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.TechnicalCareer)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.StudentCompetencyAssessments)
                    .ThenInclude(sca => sca.Student)
                        .ThenInclude(s => s.User)
            .Include(ep => ep.StudentEvaluationReports)
            .AsSplitQuery()
            .Where(ep => ep.IsActive)
            .ToListAsync();
    }

    public async Task UpdateAsync(CompetencyEvaluationInstance instance)
    {
        dbContext.CompetencyEvaluationInstances.Update(instance);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var instance = await dbContext.CompetencyEvaluationInstances.FirstOrDefaultAsync(ep => ep.Id == id);
        if (instance != null)
        {
            instance.IsActive = false;
            instance.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task UpdateStatusAsync(Guid id, EvaluationStatus status)
    {
        var instance = await dbContext.CompetencyEvaluationInstances.FirstOrDefaultAsync(ep => ep.Id == id);
        if (instance != null)
        {
            instance.Status = status;
            instance.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsByTitleAsync(string title)
    {
        return await dbContext.CompetencyEvaluationInstances.AnyAsync(ep => ep.Title == title && ep.IsActive);
    }
    
    
    public async Task<CompetencyEvaluationInstance?> GetForReportGenerationAsync(Guid id)
    {
        return await dbContext.CompetencyEvaluationInstances
            .Include(ep => ep.TechnicalCareers)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Competency)
                    .ThenInclude(c => c.LevelDescriptions)  // ← CLAVE: Incluir LevelDescriptions
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.Professor)
                        .ThenInclude(p => p.User)
            .Include(ep => ep.ProfessorCompetencyAssignments)
                .ThenInclude(pca => pca.StudentCompetencyAssessments)
                    .ThenInclude(sca => sca.Student)
                        .ThenInclude(s => s.User)
            .AsSplitQuery()
            .FirstOrDefaultAsync(ep => ep.Id == id && ep.IsActive);
    }

    public async Task<CompetencyEvaluationInstance?> GetByIdWithDetailsAsync(Guid id)
    {
        return await dbContext.CompetencyEvaluationInstances
            .Include("TechnicalCareers")
            .Include("ProfessorCompetencyAssignments.Competency")
            .Include("ProfessorCompetencyAssignments.Subject.Professor.User")
            .Include("ProfessorCompetencyAssignments.Subject.TechnicalCareer")
            .Include("ProfessorCompetencyAssignments.StudentCompetencyAssessments.Student.User")
            .Include("StudentEvaluationReports")
            .AsSplitQuery()
            .FirstOrDefaultAsync(ep => ep.Id == id && ep.IsActive);
    }
}