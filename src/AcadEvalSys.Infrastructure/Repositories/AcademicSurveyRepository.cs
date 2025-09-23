using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class AcademicSurveyRepository(ApplicationDbContext db, ISubjectRepository subjectRepository) : IAcademicSurveyRepository
{

    public async Task<Guid> CreateAsync(AcademicSurvey survey, CancellationToken ct = default)
    {
        survey.CreatedAt = DateTime.UtcNow;
        survey.IsActive = true;

        survey.Status = survey.PublishAt.HasValue && survey.PublishAt.Value <= DateTime.Now
            ? SurveyStatus.Published
            : SurveyStatus.Draft;

        await db.AcademicSurveys.AddAsync(survey, ct);
        return survey.Id;
    }
    
    public async Task ConfigureSurveyAudienceAsync(Guid surveyId, IEnumerable<(Guid TechnicalCareerId, IEnumerable<CareerYear> SelectedYears)> audience, CancellationToken ct = default)
    {
        var audienceList = audience.ToList();
        if (!audienceList.Any()) return;

        var validSubjectIds = new HashSet<Guid>();
        
        foreach (var (technicalCareerId, selectedYears) in audienceList)
        {
            var subjects = await subjectRepository.GetByCareerAndYearsAsync(
                new[] { technicalCareerId }, 
                selectedYears, 
                ct);
            
            foreach (var subject in subjects)
            {
                validSubjectIds.Add(subject.Id);
            }
        }

        // Crear las nuevas relaciones AcademicSurveySubject en lote
        var newSurveySubjects = validSubjectIds.Select(subjectId => new AcademicSurveySubject
        {
            AcademicSurveyId = surveyId,
            SubjectId = subjectId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        }).ToList();

        if (newSurveySubjects.Any())
        {
            await db.AcademicSurveySubjects.AddRangeAsync(newSurveySubjects, ct);
        }
    }

    public async Task ReplaceSurveyAudienceAsync(Guid surveyId, IEnumerable<(Guid TechnicalCareerId, IEnumerable<CareerYear> SelectedYears)> audience, CancellationToken ct = default)
    {
        // Primero eliminar las relaciones existentes
        var existingSurveySubjects = await db.AcademicSurveySubjects
            .Where(ss => ss.AcademicSurveyId == surveyId)
            .ToListAsync(ct);
        
        if (existingSurveySubjects.Any())
        {
            db.AcademicSurveySubjects.RemoveRange(existingSurveySubjects);
        }

        // Luego configurar la nueva audiencia
        await ConfigureSurveyAudienceAsync(surveyId, audience, ct);
    }

    public async Task CloseAsync(Guid surveyId,  CancellationToken ct = default)
    {
        var survey = await db.AcademicSurveys.SingleOrDefaultAsync(s => s.Id == surveyId && s.IsActive, ct);
        survey.Status = SurveyStatus.Closed;
    }

    public async Task<AcademicSurvey?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await db.AcademicSurveys
            .Include(s => s.Questions.OrderBy(q => q.Order))
            .ThenInclude(q => q.Options.OrderBy(o => o.Value))
            .Include(s => s.Subjects)
            .ThenInclude(ss => ss.Subject!)
            .ThenInclude(s => s.TechnicalCareer)
            .SingleOrDefaultAsync(s => s.Id == id && s.IsActive, ct);
    }

    public Task UpdateAsync(AcademicSurvey survey, CancellationToken ct = default)
    {
        survey.IsActive = true;
        
        // Verificar si la entidad ya está siendo rastreada
        var entry = db.Entry(survey);
        if (entry.State == EntityState.Detached)
        {
            // Solo usar Update si la entidad no está siendo rastreada
            db.AcademicSurveys.Update(survey);
        }
        else
        {
            // Si ya está siendo rastreada, marcar como modificada
            entry.State = EntityState.Modified;
        }
        
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<AcademicSurvey>> GetAllAsync(SurveyStatus? status = null, string? search = null,
        CancellationToken ct = default)
    {
        var query = db.AcademicSurveys
            .Include(s => s.Questions.OrderBy(q => q.Order))
            .ThenInclude(q => q.Options.OrderBy(o => o.Value))
            .Include(s => s.Subjects)
            .ThenInclude(ss => ss.Subject!)
            .ThenInclude(s => s.TechnicalCareer)
            .Where(s => s.IsActive)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(s => s.Status == status);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => EF.Functions.ILike(s.Title, $"%{search}%"));

        return await query
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public Task<bool> ExistsTitleAsync(string title, Guid? excludingId = null, CancellationToken ct = default)
    {
        return db.AcademicSurveys.AnyAsync(
            s => s.IsActive && s.Title == title && (!excludingId.HasValue || s.Id != excludingId.Value), ct);
    }

    public async Task ReplaceSurveyQuestionsAsync(Guid surveyId, IEnumerable<SurveyQuestion> questions, CancellationToken ct = default)
    {
        // Primero eliminar las opciones existentes (por relaciones FK)
        var existingOptions = await db.SurveyQuestionOptions
            .Where(o => o.SurveyQuestion!.AcademicSurveyId == surveyId)
            .ToListAsync(ct);
        
        if (existingOptions.Any())
        {
            db.SurveyQuestionOptions.RemoveRange(existingOptions);
        }

        // Luego eliminar las preguntas existentes
        var existingQuestions = await db.SurveyQuestions
            .Where(q => q.AcademicSurveyId == surveyId)
            .ToListAsync(ct);
        
        if (existingQuestions.Any())
        {
            db.SurveyQuestions.RemoveRange(existingQuestions);
        }

        // Crear las nuevas preguntas
        var questionsList = questions.ToList();
        if (!questionsList.Any()) return;

        foreach (var question in questionsList)
        {
            question.AcademicSurveyId = surveyId;
            question.CreatedAt = DateTime.UtcNow;
            question.IsActive = true;
        }

        await db.SurveyQuestions.AddRangeAsync(questionsList, ct);
    }

    public async Task<AcademicSurvey?> GetSurveyWithSubjectsAsync(Guid surveyId, CancellationToken ct = default)
    {
        return await db.AcademicSurveys
            .Include(s => s.Subjects)
                .ThenInclude(ss => ss.Subject!)
                    .ThenInclude(sub => sub.TechnicalCareer)
            .Include(s => s.Questions)
                .ThenInclude(q => q.Options)
            .SingleOrDefaultAsync(s => s.Id == surveyId && s.IsActive, ct);
    }

    public async Task<IReadOnlyList<AcademicSurveySubject>> GetAudienceSurveySubjectsAsync(
        Guid surveyId,
        Guid technicalCareerId,
        CareerYear year,
        CancellationToken ct = default)
    {
        return await db.AcademicSurveySubjects
            .Include(ss => ss.Subject!)
                .ThenInclude(sub => sub.TechnicalCareer)
            .Where(ss => ss.AcademicSurveyId == surveyId
                         && ss.SubjectId != null
                         && ss.Subject!.TechnicalCareerId == technicalCareerId
                         && ss.Subject!.Year == year
                         && ss.IsActive)
            .ToListAsync(ct);
    }
}
