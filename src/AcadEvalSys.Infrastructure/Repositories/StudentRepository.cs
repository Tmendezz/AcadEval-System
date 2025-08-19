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
        return await dbContext.StudentSubjects
            .AnyAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive);
    }

    public async Task EnrollInSubjectAsync(string studentId, Guid subjectId, string createdByUserId)
    {
        var existingEnrollment = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId);

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
        var studentSubject = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive);

        if (studentSubject != null)
        {
            studentSubject.IsActive = false;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Student>> GetAvailableStudentsForSubjectAsync(Guid technicalCareerId, Guid subjectId, Domain.Enums.CareerYear? year = null)
    {
        var query = dbContext.Students.AsQueryable()
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .Where(s => s.TechnicalCareerId == technicalCareerId)
            .Where(s => !dbContext.StudentSubjects.Any(ss => 
                ss.StudentId == s.UserId && 
                ss.SubjectId == subjectId && 
                ss.IsActive));

        if (year.HasValue)
        {
            query = query.Where(s => s.CurrentYear == year.Value);
        }

        return await query
            .OrderBy(s => s.CurrentYear) // Ordenar por año primero
            .ThenBy(s => s.User.Name)     // Luego por nombre
            .ToListAsync();
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
