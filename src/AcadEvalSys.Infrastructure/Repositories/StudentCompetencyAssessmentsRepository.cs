using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentCompetencyAssessmentsRepository(ApplicationDbContext context) : IStudentCompetencyAssessmentsRepository
{
    public async Task<StudentCompetencyAssessment?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId)
    {
        return await context.StudentCompetencyAssessments
            .Include(a => a.ProfessorCompetencyAssignment)
            .Include(a => a.Student)
                .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.StudentId == studentId && 
                a.ProfessorCompetencyAssignment.CompetencyEvaluationInstanceId == evaluationInstanceId);
    }

    public async Task<StudentCompetencyAssessment?> GetByStudentAndAssignmentAsync(string studentId, Guid professorCompetencyAssignmentId)
    {
        return await context.StudentCompetencyAssessments
            .Include(a => a.ProfessorCompetencyAssignment)
                .ThenInclude(pca => pca.StudentCompetencyAssessments)
            .Include(a => a.Student)
                .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.StudentId == studentId && 
                a.ProfessorCompetencyAssignmentId == professorCompetencyAssignmentId);
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetByEvaluationInstanceAsync(Guid evaluationInstanceId)
    {
        return await context.StudentCompetencyAssessments
            .Include(a => a.ProfessorCompetencyAssignment)
                .ThenInclude(pca => pca.Competency)
            .Include(a => a.ProfessorCompetencyAssignment)
                .ThenInclude(pca => pca.Subject)
            .Include(a => a.Student)
                .ThenInclude(s => s.User)
            .Where(a => a.ProfessorCompetencyAssignment.CompetencyEvaluationInstanceId == evaluationInstanceId)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetByAssignmentAsync(Guid professorCompetencyAssignmentId)
    {
        return await context.StudentCompetencyAssessments
            .Include(a => a.Student)
                .ThenInclude(s => s.User)
            .Include(a => a.ProfessorCompetencyAssignment)
                .ThenInclude(pca => pca.Subject)
            .Include(a => a.ProfessorCompetencyAssignment)
                .ThenInclude(pca => pca.Competency)
                    .ThenInclude(c => c.LevelDescriptions)
            .Where(a => a.ProfessorCompetencyAssignmentId == professorCompetencyAssignmentId)
            .ToListAsync();
    }

    public async Task UpdateAsync(StudentCompetencyAssessment assessment)
    {
        context.StudentCompetencyAssessments.Update(assessment);
        await context.SaveChangesAsync();
    }
}
