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
        // Obtener todos los estudiantes inscritos activamente en la materia para el año académico actual
        var currentYear = DateTime.Now.Year;
        var enrolledStudents = await _context.StudentSubjects
            .Where(ss => ss.SubjectId == assignment.SubjectId && 
                        ss.IsActive && 
                        ss.AcademicYear == currentYear)
            .Select(ss => ss.StudentId)
            .ToListAsync();

        if (!enrolledStudents.Any())
        {
            return; // No hay estudiantes inscritos activamente en esta materia
        }

        var studentAssessments = new List<StudentCompetencyAssessment>();

        // Para cada estudiante, verificar si YA existe un assessment para esta competencia
        foreach (var studentId in enrolledStudents)
        {
            // Verificar si ya existe un StudentCompetencyAssessment para este estudiante
            // con la misma competencia en esta instancia de evaluación
            var existingAssessment = await _context.StudentCompetencyAssessments
                .AnyAsync(sca => 
                    sca.StudentId == studentId &&
                    sca.ProfessorCompetencyAssignment!.CompetencyId == assignment.CompetencyId &&
                    sca.ProfessorCompetencyAssignment.CompetencyEvaluationInstanceId == assignment.CompetencyEvaluationInstanceId);

            // Solo crear si NO existe ya un assessment
            // (Esto evita duplicados cuando el estudiante cursa la misma competencia en múltiples materias)
            if (!existingAssessment)
            {
                studentAssessments.Add(new StudentCompetencyAssessment
                {
                    StudentId = studentId,
                    ProfessorCompetencyAssignmentId = assignment.Id,
                    Status = AssessmentStatus.Pending,
                    CompetencyLevel = null,
                    CreatedByUserId = assignment.CreatedByUserId,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        if (studentAssessments.Any())
        {
            _context.StudentCompetencyAssessments.AddRange(studentAssessments);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null)
    {
        var query = _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency)
                .ThenInclude(c => c.LevelDescriptions)
            .Include(pca => pca.Subject)
                .ThenInclude(s => s.TechnicalCareer)
            .Include(pca => pca.CompetencyEvaluationInstance)
            .Include(pca => pca.StudentCompetencyAssessments!)
                .ThenInclude(sca => sca.Student!)
                    .ThenInclude(s => s.User)
            .Where(pca => pca.Subject!.ProfessorId == professorId && 
                         pca.CompetencyEvaluationInstance != null && // Solo asignaciones con evaluación existente
                         pca.IsActive && // Solo asignaciones activas (no borradas)
                         pca.CompetencyEvaluationInstance.IsActive); // Solo instancias de evaluación activas

        if (evaluationInstanceId.HasValue)
        {
            query = query.Where(pca => pca.CompetencyEvaluationInstanceId == evaluationInstanceId);
        }

        var result = await query.ToListAsync();
        
        Console.WriteLine($"GetProfessorAssignmentsAsync: Found {result.Count()} assignments for professor {professorId}");
        foreach (var assignment in result)
        {
            Console.WriteLine($"Assignment: {assignment.Id}, Subject: {assignment.Subject?.Name}, Competency: {assignment.Competency?.Name}, Career: {assignment.Subject?.TechnicalCareer?.Name}, Year: {assignment.Subject?.Year}, Students: {assignment.StudentCompetencyAssessments?.Count ?? 0}");
        }
        
        return result;
    }

    public async Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id)
    {
        return await _context.ProfessorCompetencyAssignments
            .Include(pca => pca.Competency)
                .ThenInclude(c => c.LevelDescriptions)
            .Include(pca => pca.Subject)
                .ThenInclude(s => s.TechnicalCareer)
            .Include(pca => pca.CompetencyEvaluationInstance)
            .Include(pca => pca.StudentCompetencyAssessments!)
                .ThenInclude(sca => sca.Student!)
                    .ThenInclude(s => s.User)
            .Where(pca => pca.IsActive) // Solo asignaciones activas
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
                         && pca.Subject.Year == year
                         && pca.IsActive) // Solo asignaciones activas
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<StudentCompetencyAssessment>> GetAssignmentStudentsAsync(
        Guid assignmentId, 
        CancellationToken cancellationToken = default)
    {
        return await _context.StudentCompetencyAssessments
            .Include(sca => sca.Student)
                .ThenInclude(s => s.User)
            .Include(sca => sca.ProfessorCompetencyAssignment)
            .Where(sca => sca.ProfessorCompetencyAssignmentId == assignmentId
                         && sca.IsActive // Solo assessments activos
                         && sca.ProfessorCompetencyAssignment!.IsActive) // Solo si la asignación está activa
            .OrderBy(sca => sca.Student.User.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Professor?> GetProfessorByUserIdAsync(string userId)
    {
        return await _context.Professors
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }
}