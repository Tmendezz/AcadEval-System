using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
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

        // Generar automáticamente los StudentCompetencyAssessments para todos los estudiantes de la materia
        await CreateStudentCompetencyAssessmentsAsync(assignment);

        return assignment.Id;
    }

    private async Task CreateStudentCompetencyAssessmentsAsync(ProfessorCompetencyAssignment assignment)
    {
        // Obtener todos los estudiantes inscritos en la materia
        var enrolledStudents = await _context.StudentSubjects
            .Where(ss => ss.SubjectId == assignment.SubjectId)
            .Select(ss => ss.StudentId)
            .ToListAsync();

        if (!enrolledStudents.Any())
        {
            return; // No hay estudiantes inscritos en esta materia
        }

        // Crear un StudentCompetencyAssessment para cada estudiante
        var studentAssessments = enrolledStudents.Select(studentId => new StudentCompetencyAssessment
        {
            StudentId = studentId,
            ProfessorCompetencyAssignmentId = assignment.Id,
            Status = AssessmentStatus.Pending,
            CompetencyLevel = CompetencyLevel.Inicial, // Nivel inicial
            CreatedByUserId = assignment.CreatedByUserId,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _context.StudentCompetencyAssessments.AddRange(studentAssessments);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null)
    {
        var query = _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency)
            .Include(pca => pca.Subject)
            .Include(pca => pca.StudentCompetencyAssessments!)
                .ThenInclude(sca => sca.Student!)
                    .ThenInclude(s => s.User)
            .Where(pca => pca.Subject!.ProfessorId == professorId);

        if (evaluationInstanceId.HasValue)
        {
            query = query.Where(pca => pca.CompetencyEvaluationInstanceId == evaluationInstanceId);
        }

        return await query.ToListAsync();
    }

    public async Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency)
            .Include(pca => pca.Subject)
            .Include(pca => pca.StudentCompetencyAssessments!)
                .ThenInclude(sca => sca.Student!)
                    .ThenInclude(s => s.User)
            .FirstOrDefaultAsync(pca => pca.Id == id);
    }

    public async Task UpdateAsync(ProfessorCompetencyAssignment assignment)
    {
        _context.ProfessorCompetencyAssignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetCareerYearAssignmentDetailsAsync(
        Guid evaluationId, 
        Guid careerId, 
        CareerYear year, 
        CancellationToken cancellationToken = default)
    {
        // Query simple que retorna las entidades del dominio con includes
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency)
            .Include(pca => pca.Subject)
                .ThenInclude(s => s.Professor)
                .ThenInclude(p => p.User)
            .Include(pca => pca.StudentCompetencyAssessments)
                .ThenInclude(sca => sca.Student)
                .ThenInclude(s => s.User)
            .Where(pca => pca.CompetencyEvaluationInstanceId == evaluationId
                         && pca.Subject.TechnicalCareerId == careerId
                         && pca.Subject.Year == year)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetAssignmentStudentsAsync(
        Guid assignmentId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.StudentCompetencyAssessments
            .Include(sca => sca.Student)
                .ThenInclude(s => s.User)
            .Where(sca => sca.ProfessorCompetencyAssignmentId == assignmentId)
            .OrderBy(sca => sca.Student.User.Name)
            .ToListAsync(cancellationToken);
    }


}