using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentEvaluationReportRepository : IStudentEvaluationReportRepository
{
    private readonly ApplicationDbContext _context;

    public StudentEvaluationReportRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentEvaluationReport> CreateAsync(StudentEvaluationReport report)
    {
        _context.StudentEvaluationReports.Add(report);
        await _context.SaveChangesAsync();
        return report;
    }

    public async Task<StudentEvaluationReport?> GetByIdAsync(Guid reportId)
    {
        return await _context.StudentEvaluationReports
            .Include(r => r.Student)
                .ThenInclude(s => s.User)
            .Include(r => r.CompetencyEvaluationInstance)
            .FirstOrDefaultAsync(r => r.Id == reportId);
    }

    public async Task<StudentEvaluationReport?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId)
    {
        return await _context.StudentEvaluationReports
            .Include(r => r.Student)
            .Include(r => r.CompetencyEvaluationInstance)
            .FirstOrDefaultAsync(r => r.StudentId == studentId && r.CompetencyEvaluationInstanceId == evaluationInstanceId);
    }

    public async Task<IEnumerable<StudentEvaluationReport>> GetByStudentIdAsync(string studentId)
    {
        return await _context.StudentEvaluationReports
            .Include(r => r.Student)
            .Include(r => r.CompetencyEvaluationInstance)
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.GeneratedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentEvaluationReport>> GetByInstanceIdAsync(Guid evaluationInstanceId)
    {
        return await _context.StudentEvaluationReports
            .Include(r => r.Student)
            .Include(r => r.CompetencyEvaluationInstance)
            .Where(r => r.CompetencyEvaluationInstanceId == evaluationInstanceId)
            .OrderByDescending(r => r.GeneratedAt)
            .ToListAsync();
    }

    public async Task UpdateAsync(StudentEvaluationReport report)
    {
        _context.StudentEvaluationReports.Update(report);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid reportId)
    {
        var report = await _context.StudentEvaluationReports.FindAsync(reportId);
        if (report != null)
        {
            _context.StudentEvaluationReports.Remove(report);
            await _context.SaveChangesAsync();
        }
    }
}
