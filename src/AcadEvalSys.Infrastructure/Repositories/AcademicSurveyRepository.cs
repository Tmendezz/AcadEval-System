using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class AcademicSurveyRepository(ApplicationDbContext db) : IAcademicSurveyRepository
{
    public async Task<Guid> CreateFromTemplateAsync(string title, Guid templateId, DateTime? publishAt, DateTime? closeAt, string? userId = null, CancellationToken ct = default)
    {
        // Cargar plantilla con hijos
        var template = await db.SurveyTemplates
            .AsNoTracking()
            .Include(t => t.Questions.OrderBy(q => q.Order))
                .ThenInclude(q => q.Options.OrderBy(o => o.Order))
            .SingleOrDefaultAsync(t => t.Id == templateId && t.IsActive, ct);

        if (template is null)
            throw new KeyNotFoundException("Template no encontrada o inactiva");

        // Crear encuesta
        var survey = new AcademicSurvey
        {
            Title = title,
            TemplateId = template.Id,
            PublishAt = publishAt,
            CloseAt = closeAt,
            Status = SurveyStatus.Draft,
            CreatedByUserId = userId
        };

        // Snapshot de preguntas/opciones
        foreach (var q in template.Questions)
        {
            var sq = new SurveyQuestion
            {
                Text = q.Text,
                Type = q.Type,
                Order = q.Order,
                IsRequired = q.isRequired
            };

            foreach (var o in q.Options)
            {
                sq.Options.Add(new SurveyQuestionOption
                {
                    Value = o.Value,
                    Text = o.Text,
                    Order = o.Order,
                    AllowOpenText = o.AllowOpenText
                });
            }

            survey.Questions.Add(sq);
        }

        db.AcademicSurveys.Add(survey);
        await db.SaveChangesAsync(ct);

        return survey.Id;
    }

    public async Task SetSubjectsAsync(Guid surveyId, IEnumerable<Guid> subjectIds, string? userId = null, CancellationToken ct = default)
    {
        var survey = await db.AcademicSurveys
            .Include(s => s.Subjects)
            .SingleOrDefaultAsync(s => s.Id == surveyId && s.IsActive, ct);

        if (survey is null)
            throw new KeyNotFoundException("Encuesta no encontrada o inactiva");

        var desired = subjectIds.Distinct().ToHashSet();

        var toRemove = survey.Subjects.Where(x => x.SubjectId.HasValue && !desired.Contains(x.SubjectId.Value)).ToList();
        db.AcademicSurveySubjects.RemoveRange(toRemove);

        var existing = survey.Subjects.Where(x => x.SubjectId.HasValue).Select(x => x.SubjectId!.Value).ToHashSet();
        var toAdd = desired.Except(existing);

        foreach (var sid in toAdd)
        {
            survey.Subjects.Add(new AcademicSurveySubject
            {
                AcademicSurveyId = survey.Id,
                SubjectId = sid,
                CreatedByUserId = userId
            });
        }

        survey.UpdatedByUserId = userId;
        survey.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }

    public async Task PublishAsync(Guid surveyId, DateTime? publishAt = null, CancellationToken ct = default)
    {
        var survey = await db.AcademicSurveys
            .Include(s => s.Questions)
            .Include(s => s.Subjects)
            .SingleOrDefaultAsync(s => s.Id == surveyId && s.IsActive, ct);

        if (survey is null)
            throw new KeyNotFoundException("Encuesta no encontrada o inactiva");

        if (!survey.Questions.Any())
            throw new InvalidOperationException("La encuesta no tiene preguntas");

        if (!survey.Subjects.Any())
            throw new InvalidOperationException("La encuesta no tiene materias asignadas");

        survey.Status = SurveyStatus.Published;
        survey.PublishAt = publishAt ?? DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }

    public async Task CloseAsync(Guid surveyId, DateTime? closeAt = null, CancellationToken ct = default)
    {
        var survey = await db.AcademicSurveys.SingleOrDefaultAsync(s => s.Id == surveyId && s.IsActive, ct);
        if (survey is null)
            throw new KeyNotFoundException("Encuesta no encontrada o inactiva");

        survey.Status = SurveyStatus.Closed;
        survey.CloseAt = closeAt ?? DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }

    public async Task<AcademicSurvey?> GetByIdAsync(Guid id, bool includeChildren = true, CancellationToken ct = default)
    {
        var query = db.AcademicSurveys.AsQueryable();

        if (includeChildren)
        {
            query = query
                .Include(s => s.Questions.OrderBy(q => q.Order))
                    .ThenInclude(q => q.Options.OrderBy(o => o.Order))
                .Include(s => s.Subjects)
                    .ThenInclude(ss => ss.Subject!);
        }

        return await query.AsNoTracking().SingleOrDefaultAsync(s => s.Id == id && s.IsActive, ct);
    }

    public async Task<IReadOnlyList<AcademicSurvey>> ListAsync(SurveyStatus? status = null, Guid? technicalCareerId = null, Guid? subjectId = null, string? search = null, CancellationToken ct = default)
    {
        var query = db.AcademicSurveys
            .Where(s => s.IsActive)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(s => s.Status == status);

        if (subjectId.HasValue || technicalCareerId.HasValue)
        {
            query = query.Where(s => s.Subjects.Any());
            if (subjectId.HasValue)
                query = query.Where(s => s.Subjects.Any(ss => ss.SubjectId == subjectId));
            if (technicalCareerId.HasValue)
                query = query.Where(s => s.Subjects.Any(ss => ss.Subject!.TechnicalCareerId == technicalCareerId));
        }

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => EF.Functions.ILike(s.Title, $"%{search}%"));

        return await query
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .ToListAsync(ct);
    }

    public Task<bool> ExistsTitleAsync(string title, Guid? excludingId = null, CancellationToken ct = default)
    {
        return db.AcademicSurveys.AnyAsync(s => s.IsActive && s.Title == title && (!excludingId.HasValue || s.Id != excludingId.Value), ct);
    }

    public async Task<AcademicSurveySubject?> GetSubjectGraphAsync(Guid surveySubjectId, CancellationToken ct = default)
    {
        return await db.AcademicSurveySubjects
            .Include(s => s.AcademicSurvey!)
                .ThenInclude(sv => sv.Template)               // AÑADIR
            .Include(s => s.AcademicSurvey!)
                .ThenInclude(sv => sv.Questions)
                    .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(s => s.Id == surveySubjectId && s.IsActive, ct);
    }

    public async  Task<AcademicSurveyResponse?> GetResponseAsync(Guid surveySubjectId, string userId, CancellationToken ct = default)
    {
        return await db.AcademicSurveyResponses
            .Include(r => r.QuestionResponses)
            .FirstOrDefaultAsync(r => r.AcademicSurveySubjectId == surveySubjectId && r.UserId == userId, ct);
    }

    public async Task<Guid> CreateResponseAsync(AcademicSurveyResponse response, CancellationToken ct = default)
    {
        db.AcademicSurveyResponses.Add(response);
        await db.SaveChangesAsync(ct);
        return response.Id;
    }

    public async Task UpdateResponseAsync(AcademicSurveyResponse response, CancellationToken ct = default)
    {
        var existing = await db.AcademicSurveyResponses
            .Include(r => r.QuestionResponses)
            .FirstOrDefaultAsync(r => r.Id == response.Id, ct);

        if (existing is null)
            throw new KeyNotFoundException($"Survey response {response.Id} no encontrada.");

        // El handler ya armó la nueva lista: reemplazar para evitar duplicados
        db.SurveyQuestionResponses.RemoveRange(existing.QuestionResponses);
        existing.QuestionResponses = response.QuestionResponses;

        existing.SubmittedAt = response.SubmittedAt;
        existing.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<AcademicSurveyResponse>> GetResponsesBySurveyIdAsync(
    Guid surveyId,
    bool includeDetails = true,
    CancellationToken ct = default)
    {
        var query = db.AcademicSurveyResponses
            .Where(r => r.AcademicSurveySubjectId != null &&
                        db.AcademicSurveySubjects.Any(s => s.Id == r.AcademicSurveySubjectId && s.AcademicSurveyId == surveyId));

        if (includeDetails)
        {
            query = query
                .Include(r => r.QuestionResponses)
                .ThenInclude(qr => qr.SurveyQuestion);
        }

        return await query
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<AcademicSurveyResponse>> GetResponsesBySurveySubjectIdAsync(
    Guid surveySubjectId,
    bool includeDetails = true,
    CancellationToken ct = default)
    {
        var query = db.AcademicSurveyResponses
            .Where(r => r.AcademicSurveySubjectId == surveySubjectId);

        if (includeDetails)
        {
            query = query
                .Include(r => r.QuestionResponses)
                .ThenInclude(qr => qr.SurveyQuestion);
        }

        return await query
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync(ct);
    }
}