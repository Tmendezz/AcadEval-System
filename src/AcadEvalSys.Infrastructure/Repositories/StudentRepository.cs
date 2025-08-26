using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentRepository(ApplicationDbContext dbContext, ILogger<StudentRepository> logger) : IStudentRepository
{
    public async Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, Guid? technicalCareerId = null, AcadEvalSys.Domain.Enums.CareerYear? currentYear = null)
    {
        var query = dbContext.Students
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(s => s.User!.Name.Contains(searchTerm) || 
                                   s.User!.Email!.Contains(searchTerm));
        }

        if (technicalCareerId.HasValue)
        {
            query = query.Where(s => s.TechnicalCareerId == technicalCareerId);
        }

        if (currentYear.HasValue)
        {
            query = query.Where(s => s.CurrentYear == currentYear);
        }

        var totalCount = await query.CountAsync();
        
        var students = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (students, totalCount);
    }

    public async Task<Student?> GetByIdAsync(string studentId)
    {
        return await dbContext.Students
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .Include(s => s.StudentSubjects!)
                .ThenInclude(ss => ss.Subject!)
                    .ThenInclude(s => s.TechnicalCareer)
            .FirstOrDefaultAsync(s => s.UserId == studentId);
    }

    public async Task<Student?> GetByUserIdAsync(string userId)
    {
        return await dbContext.Students
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task CreateAsync(Student student)
    {
        dbContext.Students.Add(student);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Student student)
    {
        dbContext.Students.Update(student);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var student = await dbContext.Students.FirstOrDefaultAsync(s => s.UserId == id);
        if (student != null)
        {
            // Borrado físico - las entidades Student no tienen IsActive
            dbContext.Students.Remove(student);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<bool> IsEnrolledInSubjectAsync(string studentId, Guid subjectId)
    {
        var currentYear = DateTime.Now.Year;
        return await dbContext.StudentSubjects
            .AnyAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive && ss.AcademicYear == currentYear);
    }

    public async Task EnrollInSubjectAsync(string studentId, Guid subjectId, string createdByUserId)
    {
        var currentYear = DateTime.Now.Year;
        var existingEnrollment = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.AcademicYear == currentYear);

        if (existingEnrollment != null)
        {
            existingEnrollment.IsActive = true;
            existingEnrollment.UpdatedAt = DateTime.UtcNow;
            existingEnrollment.UpdatedByUserId = createdByUserId;
        }
        else
        {
            var studentSubject = new StudentSubject
            {
                StudentId = studentId,
                SubjectId = subjectId,
                AcademicYear = currentYear,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = createdByUserId,
                IsActive = true
            };
            dbContext.StudentSubjects.Add(studentSubject);
        }

        await dbContext.SaveChangesAsync();
    }

    public async Task UnenrollFromSubjectAsync(string studentId, Guid subjectId)
    {
        var currentYear = DateTime.Now.Year;
        var studentSubject = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive && ss.AcademicYear == currentYear);

        if (studentSubject != null)
        {
            studentSubject.IsActive = false;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Student>> GetAvailableStudentsForSubjectAsync(Guid technicalCareerId, Guid subjectId, Domain.Enums.CareerYear? year = null)
    {
        var query = dbContext.Students.AsQueryable()
            .Where(s => s.TechnicalCareerId == technicalCareerId);

        if (year.HasValue)
        {
            query = query.Where(s => s.CurrentYear == year.Value);
        }

        // Excluir estudiantes ya inscritos en esta materia para el año actual
        var currentYear = DateTime.Now.Year;
        var enrolledStudentIds = await dbContext.StudentSubjects
            .Where(ss => ss.SubjectId == subjectId && ss.IsActive && ss.AcademicYear == currentYear)
            .Select(ss => ss.StudentId)
            .ToListAsync();

        if (enrolledStudentIds.Any())
        {
            query = query.Where(s => !enrolledStudentIds.Contains(s.UserId));
        }

        return await query
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .ToListAsync();
    }

    public async Task<int> RevokeEnrollmentsByYearAsync(int academicYear)
    {
        var enrollmentsToRevoke = await dbContext.StudentSubjects
            .Where(ss => ss.AcademicYear == academicYear && ss.IsActive)
            .ToListAsync();

        foreach (var enrollment in enrollmentsToRevoke)
        {
            enrollment.IsActive = false;
            enrollment.UpdatedAt = DateTime.UtcNow;
            // Nota: No establecemos UpdatedByUserId ya que es una revocación automática del sistema
        }

        await dbContext.SaveChangesAsync();
        
        return enrollmentsToRevoke.Count;
    }

    /// <summary>
    /// Actualiza el año académico del estudiante si el año de la asignatura es superior al año actual del estudiante.
    /// Esto permite el avance automático de año cuando los estudiantes se inscriben en materias de años superiores.
    /// </summary>
    /// <param name="studentId">ID del estudiante</param>
    /// <param name="subjectYear">Año de la asignatura en la que se está inscribiendo</param>
    public async Task UpdateStudentYearIfNeededAsync(string studentId, Domain.Enums.CareerYear subjectYear)
    {
        var student = await dbContext.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == studentId);

        if (student != null && (int)subjectYear > (int)student.CurrentYear)
        {
            var previousYear = student.CurrentYear;
            student.CurrentYear = subjectYear;
            await dbContext.SaveChangesAsync();
            
            logger.LogInformation("Student {StudentName} ({StudentId}) year updated from {PreviousYear} to {NewYear} due to enrollment in higher year subject", 
                student.User?.Name, student.UserId, previousYear, subjectYear);
        }
    }
}
