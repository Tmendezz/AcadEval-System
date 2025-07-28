using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentRepository(ApplicationDbContext dbContext) : IStudentRepository
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

    public async Task EnrollInSubjectAsync(string studentId, Guid subjectId)
    {
        var existingEnrollment = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId);

        if (existingEnrollment != null)
        {
            existingEnrollment.IsActive = true;
            existingEnrollment.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var studentSubject = new StudentSubject
            {
                StudentId = studentId,
                SubjectId = subjectId,
                CreatedAt = DateTime.UtcNow,
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
}
