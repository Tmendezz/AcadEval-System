using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class SubjectRepository(ApplicationDbContext dbContext) : ISubjectRepository
{
    public async Task<Guid> CreateSubjectAsync(Subject subject)
    {
        var result = dbContext.Subjects.Add(subject);
        await dbContext.SaveChangesAsync();
        return result.Entity.Id;
    }

    public async Task<Subject?> GetSubjectByIdAsync(Guid id)
    {
        var subject = await dbContext.Subjects
            .Where(s => s.Id == id && s.IsActive)
            .Include(s => s.TechnicalCareer)
            .Include(s => s.Professor!)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync();

        if (subject != null)
        {
            // Cargar StudentSubjects con Students por separado
            subject.StudentSubjects = await dbContext.StudentSubjects
                .Where(ss => ss.SubjectId == id && ss.IsActive)
                .Include(ss => ss.Student!)
                    .ThenInclude(s => s.User)
                .Include(ss => ss.Student!)
                    .ThenInclude(s => s.TechnicalCareer)
                .ToListAsync();
        }

        return subject;
    }

    public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
    {
        var subjects = await dbContext.Subjects
            .Where(s => s.IsActive)
            .Include(s => s.TechnicalCareer)
            .Include(s => s.Professor!)
                .ThenInclude(p => p.User)
            .ToListAsync();

        // Cargar StudentSubjects para todos los subjects
        var subjectIds = subjects.Select(s => s.Id).ToList();
        var allStudentSubjects = await dbContext.StudentSubjects
            .Where(ss => subjectIds.Contains(ss.SubjectId!.Value) && ss.IsActive)
            .Include(ss => ss.Student!)
                .ThenInclude(s => s.User)
            .Include(ss => ss.Student!)
                .ThenInclude(s => s.TechnicalCareer)
            .ToListAsync();

        // Asignar StudentSubjects a cada Subject
        foreach (var subject in subjects)
        {
            subject.StudentSubjects = allStudentSubjects
                .Where(ss => ss.SubjectId == subject.Id)
                .ToList();
        }

        return subjects;
    }

    public async Task UpdateSubjectAsync(Subject subject)
    {
        dbContext.Subjects.Update(subject);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> ExistsByNameAndCareerAsync(string name, Guid technicalCareerId)
    {
        return await dbContext.Subjects
            .AnyAsync(s => s.Name == name && s.TechnicalCareerId == technicalCareerId && s.IsActive);
    }

    public async Task<bool> ExistsByIdAsync(Guid id)
    {
        return await dbContext.Subjects
            .AnyAsync(s => s.Id == id && s.IsActive);
    }

    public async Task AssignProfessorToSubjectAsync(Guid subjectId, string professorId)
    {
        var subject = await dbContext.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId && s.IsActive);
        if (subject != null)
        {
            subject.ProfessorId = professorId;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task RemoveProfessorFromSubjectAsync(Guid subjectId)
    {
        var subject = await dbContext.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId && s.IsActive);
        if (subject != null)
        {
            subject.ProfessorId = null;
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(Subject subject)
    {
        dbContext.Subjects.Update(subject);
        await dbContext.SaveChangesAsync();
    }

    public async Task<bool> UserTeachesInCareerAsync(string userId, Guid technicalCareerId)
    {
        return await dbContext.Subjects
            .AnyAsync(s => s.IsActive && s.TechnicalCareerId == technicalCareerId && s.ProfessorId == userId);
    }

    public async Task<IEnumerable<Subject>> GetByProfessorIdAsync(string professorId)
    {
        return await dbContext.Subjects
            .Where(s => s.ProfessorId == professorId && s.IsActive)
            .Include(s => s.TechnicalCareer)
            .ToListAsync();
    }

    // Devuelve una lsita de todas las asignaturas que forman parte de la encuesta
    public async Task<IEnumerable<Subject>> GetByCareerAndYearsAsync(
        IEnumerable<Guid> careerIds, 
        IEnumerable<CareerYear> years, 
        CancellationToken cancellationToken = default)
    {
        var careerIdsList = careerIds.ToList();
        var yearsList = years.ToList();

        return await dbContext.Subjects
            .Where(s => s.IsActive && 
                       careerIdsList.Contains(s.TechnicalCareerId ?? Guid.Empty) &&
                       yearsList.Contains(s.Year))
            .Include(s => s.TechnicalCareer)
            .Include(s => s.Professor!)
                .ThenInclude(p => p.User)
            .ToListAsync(cancellationToken);
    }
}