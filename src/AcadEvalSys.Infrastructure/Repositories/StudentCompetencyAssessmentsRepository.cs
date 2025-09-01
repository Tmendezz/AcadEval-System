using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentCompetencyAssessmentsRepository(ApplicationDbContext context) : IStudentCompetencyAssessmentsRepository
{
    public async Task<StudentCompetencyAssessment?> GetByStudentAndAssignmentAsync(string studentId, Guid professorCompetencyAssignmentId)
    {
        return await context.StudentCompetencyAssessments
            .Include(sca => sca.Student!)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Competency)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
            .FirstOrDefaultAsync(sca => sca.StudentId == studentId &&
                                      sca.ProfessorCompetencyAssignmentId == professorCompetencyAssignmentId);
    }

    public async Task<StudentCompetencyAssessment?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId)
    {
        return await context.StudentCompetencyAssessments
            .Include(sca => sca.Student!)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Competency)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
            .FirstOrDefaultAsync(sca => sca.StudentId == studentId &&
                                      sca.ProfessorCompetencyAssignment!.CompetencyEvaluationInstanceId == evaluationInstanceId);
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetByAssignmentAsync(Guid professorCompetencyAssignmentId)
    {
        return await context.StudentCompetencyAssessments
            .Include(sca => sca.Student!)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Competency)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
            .Where(sca => sca.ProfessorCompetencyAssignmentId == professorCompetencyAssignmentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetByStudentIdAsync(string studentId)
    {
        return await context.StudentCompetencyAssessments
            .Include(sca => sca.Student!)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Competency)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.TechnicalCareer)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
                    .ThenInclude(s => s.Professor)
                        .ThenInclude(p => p.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.CompetencyEvaluationInstance)
            .Where(sca => sca.StudentId == studentId)
            .ToListAsync();
    }

    public async Task UpdateAsync(StudentCompetencyAssessment assessment)
    {
        context.StudentCompetencyAssessments.Update(assessment);
        await context.SaveChangesAsync();
    }

    public async Task CreateAsync(StudentCompetencyAssessment assessment)
    {
        context.StudentCompetencyAssessments.Add(assessment);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetCompletedByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId)
    {
        return await context.StudentCompetencyAssessments
            .Include(sca => sca.Student!)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Competency).ThenInclude(pca => pca!.LevelDescriptions)
            .Include(sca => sca.ProfessorCompetencyAssignment!)
                .ThenInclude(pca => pca.Subject)
            .Where(sca => sca.StudentId == studentId &&
                          sca.ProfessorCompetencyAssignment!.CompetencyEvaluationInstanceId == evaluationInstanceId &&
                          sca.Status == AssessmentStatus.Completed)
            .ToListAsync();
    }
}
