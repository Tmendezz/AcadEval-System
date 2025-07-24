using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class StudentRepository(ApplicationDbContext dbContext) : IStudentRepository
{
    public async Task<IEnumerable<Student>> GetAllAsync()
    {
        return await dbContext.Students
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .ToListAsync();
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

    public Task<Student?> GetByIdWithDetailsAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> ExistsAsync(string studentId)
    {
        return dbContext.Students.AnyAsync(s => s.UserId == studentId);
    }

    public async Task CreateAsync(Student student)
    {
        dbContext.Students.Add(student);
        await dbContext.SaveChangesAsync();
    }

    public Task UpdateAsync(Student student)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteAsync(string id)
    {
        var student = await dbContext.Students.FindAsync(id);
        if (student != null)
        {
            dbContext.Students.Remove(student);
            await dbContext.SaveChangesAsync();
        }
    }

    public Task<bool> IsEnrolledInSubjectAsync(string studentId, Guid subjectId)
    {
        return dbContext.StudentSubjects
            .AnyAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive);
    }

    public async Task EnrollInSubjectAsync(string studentId, Guid subjectId)
    {
        var studentSubject = new StudentSubject
        {
            StudentId = studentId,
            SubjectId = subjectId
        };

        dbContext.StudentSubjects.Add(studentSubject);
        await dbContext.SaveChangesAsync();
    }

    public async Task UnenrollFromSubjectAsync(string studentId, Guid subjectId)
    {
        var studentSubject = await dbContext.StudentSubjects
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SubjectId == subjectId && ss.IsActive);

        if (studentSubject != null)
        {
            studentSubject.IsActive = false;
            studentSubject.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Student>> GetStudentsInSubjectAsync(Guid subjectId)
    {
        return await dbContext.StudentSubjects
            .Where(ss => ss.SubjectId == subjectId && ss.IsActive)
            .Include(ss => ss.Student!)
                .ThenInclude(s => s.User)
            .Include(ss => ss.Student!)
                .ThenInclude(s => s.TechnicalCareer)
            .Select(ss => ss.Student!)
            .ToListAsync();
    }

    public async Task<Student?> GetForReportGenerationAsync(string studentId)
    {
        return await dbContext.Students
            .Include(s => s.User)
            .Include(s => s.TechnicalCareer)
            .FirstOrDefaultAsync(s => s.UserId == studentId);
    }
}
