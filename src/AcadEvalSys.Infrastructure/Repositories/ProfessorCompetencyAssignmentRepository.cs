using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class ProfessorCompetencyAssignmentRepository : IProfessorCompetencyAssignmentRepository
{
    private readonly ApplicationDbContext _context;

    public ProfessorCompetencyAssignmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateAsync(ProfessorCompetencyAssignment assignment)
    {
        _context.ProfessorCompetencyAssignments.Add(assignment);
        await _context.SaveChangesAsync();
        return assignment.Id;
    }

    public async Task UpdateAsync(ProfessorCompetencyAssignment assignment)
    {
        _context.ProfessorCompetencyAssignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id)
    {
        return await _context.ProfessorCompetencyAssignments.FindAsync(id);
    }

    public async Task<ProfessorCompetencyAssignment?> GetAssignmentByIdAsync(Guid id)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency para competencyName
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject para subjectName
            .Include(pca => pca.StudentCompetencyAssessments)
                .ThenInclude(sca => sca.Student)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(pca => pca.Id == id);
    }

    public async Task<ProfessorCompetencyAssignment?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject
            .Include(pca => pca.CompetencyEvaluationInstance)
            .Include(pca => pca.StudentCompetencyAssessments)
                .ThenInclude(sca => sca.Student)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(pca => pca.Id == id);
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null)
    {
        var query = _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency para competencyName
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject para subjectName
                .ThenInclude(s => s.Professor)
                    .ThenInclude(p => p.User)
            .Include(pca => pca.StudentCompetencyAssessments)
                .ThenInclude(sca => sca.Student)
                    .ThenInclude(s => s.User)
            .Where(pca => pca.Subject.ProfessorId == professorId);

        if (evaluationInstanceId.HasValue)
        {
            query = query.Where(pca => pca.CompetencyEvaluationInstanceId == evaluationInstanceId.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetByProfessorAsync(string professorId)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject
            .Include(pca => pca.StudentCompetencyAssessments)
            .Where(pca => pca.Subject.ProfessorId == professorId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetByEvaluationInstanceAsync(Guid evaluationInstanceId)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject
            .Include(pca => pca.StudentCompetencyAssessments)
            .Where(pca => pca.CompetencyEvaluationInstanceId == evaluationInstanceId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetByEvaluationInstanceWithDetailsAsync(Guid evaluationInstanceId)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency) // ✅ INCLUIR Competency para competencyName
            .Include(pca => pca.Subject) // ✅ INCLUIR Subject para subjectName
            .Include(pca => pca.CompetencyEvaluationInstance)
            .Include(pca => pca.StudentCompetencyAssessments)
                .ThenInclude(sca => sca.Student)
                    .ThenInclude(s => s.User)
            .Where(pca => pca.CompetencyEvaluationInstanceId == evaluationInstanceId)
            .ToListAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var assignment = await _context.ProfessorCompetencyAssignments.FindAsync(id);
        if (assignment != null)
        {
            _context.ProfessorCompetencyAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByCompetenciesEvaluationInstanceIdAsync(Guid competenciesEvaluationInstanceId)
    {
        var assignments = await _context.ProfessorCompetencyAssignments
            .Where(pca => pca.CompetencyEvaluationInstanceId == competenciesEvaluationInstanceId)
            .ToListAsync();

        _context.ProfessorCompetencyAssignments.RemoveRange(assignments);
        await _context.SaveChangesAsync();
    }
}