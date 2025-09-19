using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories;

public class AcademicSurveyRepository(ApplicationDbContext db) : IAcademicSurveyRepository
{
    public async Task<Guid> CreateFromTemplateAsync(string title, string description, Guid templateId, DateTime? publishAt, DateTime? closeAt, string? userId = null, CancellationToken ct = default)
    {
        // Cargar plantilla con hijos
        var template = await db.SurveyTemplates
            .AsNoTracking()
            .Include(t => t.Questions.OrderBy(q => q.Order))
                .ThenInclude(q => q.Options.OrderBy(o => o.Order))
            .SingleOrDefaultAsync(t => t.Id == templateId && t.IsActive, ct);

        if (template is null)
            throw new KeyNotFoundException("Template no encontrada o inactiva");

        // Determinar estado inicial basado en fechas de publicación y cierre
        var now = DateTime.UtcNow;
        var initialStatus = SurveyStatus.Draft;
        
        if (publishAt.HasValue && publishAt.Value <= now)
        {
            // Si la fecha de publicación ya pasó o es ahora, publicar automáticamente
            initialStatus = SurveyStatus.Published;
            
            // Si también ya pasó la fecha de cierre, cerrar automáticamente
            if (closeAt.HasValue && closeAt.Value <= now)
            {
                initialStatus = SurveyStatus.Closed;
            }
        }

        // Crear encuesta
        var survey = new AcademicSurvey
        {
            Title = title,
            Description = description,
            PublishAt = publishAt,
            CloseAt = closeAt,
            Status = initialStatus,
            CreatedByUserId = userId
        };

        // Snapshot de preguntas/opciones
        foreach (var q in template.Questions)
        {
            Console.WriteLine($"🔍 Debug Repository - Template question: Text={q.Text}, AllowComment={q.AllowComment}");
            var sq = new SurveyQuestion
            {
                Text = q.Text,
                Type = q.Type,
                Order = q.Order,
                IsRequired = q.isRequired,
                AllowComment = q.AllowComment
            };
            Console.WriteLine($"🔍 Debug Repository - Created SurveyQuestion: Text={sq.Text}, AllowComment={sq.AllowComment}");

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

    public async Task AddSurveySubjectAsync(AcademicSurveySubject surveySubject, CancellationToken ct = default)
    {
        db.AcademicSurveySubjects.Add(surveySubject);
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

    public Task UpdateAsync(AcademicSurvey survey, CancellationToken ct = default)
    {
        db.AcademicSurveys.Update(survey);
        return db.SaveChangesAsync(ct);
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
            .ThenInclude(sv => sv.Questions)
            .ThenInclude(q => q.Options)
            .Include(s => s.Subject!)
            .ThenInclude(subj => subj.StudentSubjects)
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

    public async Task<IEnumerable<AcademicSurveySubject>> GetSurveySubjectsByAudienceAsync(
        Guid surveyId,
        string technicalCareerName,
        int year,
        CancellationToken ct = default)
    {
        var query = db.AcademicSurveySubjects
            .Where(ss => ss.IsActive && ss.AcademicSurveyId == surveyId);

        if (!string.IsNullOrWhiteSpace(technicalCareerName))
        {
            query = query.Where(ss => ss.Subject != null && ss.Subject.TechnicalCareer != null && ss.Subject.TechnicalCareer.Name == technicalCareerName);
        }

        query = query.Where(ss => ss.Subject != null && ss.Subject.Year == (CareerYear)year);

        return await query
            .Include(ss => ss.Subject)!
                .ThenInclude(s => s!.TechnicalCareer)
            .Include(ss => ss.Subject)!
                .ThenInclude(s => s!.Professor)!
                    .ThenInclude(p => p!.User)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<AcademicSurveyResponse>> GetResponsesBySurveyAndAudienceAsync(
        Guid surveyId,
        Guid careerId,
        int year,
        string role,
        CancellationToken ct = default)
    {
        var responsesQuery = db.AcademicSurveyResponses
            .Where(r => r.AcademicSurveySubjectId != null)
            .Where(r => db.AcademicSurveySubjects.Any(ss => ss.Id == r.AcademicSurveySubjectId && ss.AcademicSurveyId == surveyId))
            .Where(r => db.AcademicSurveySubjects.Any(ss => ss.Id == r.AcademicSurveySubjectId && ss.Subject != null && ss.Subject.TechnicalCareerId == careerId && ss.Subject.Year == (CareerYear)year));

        if (!string.IsNullOrWhiteSpace(role))
        {
            if (role.Equals("Student", StringComparison.OrdinalIgnoreCase))
            {
                responsesQuery = responsesQuery.Where(r => db.Students.Any(s => s.UserId == r.UserId));
            }
            else if (role.Equals("Professor", StringComparison.OrdinalIgnoreCase))
            {
                responsesQuery = responsesQuery.Where(r => db.Professors.Any(p => p.UserId == r.UserId));
            }
        }

        return await responsesQuery
            .Include(r => r.QuestionResponses)
                .ThenInclude(qr => qr.SurveyQuestion)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<(AcademicSurvey Survey, AcademicSurveySubject SurveySubject, bool HasResponded, DateTime? RespondedAt)>> GetUserSurveysWithResponseInfoAsync(Guid userId, CancellationToken ct = default)
    {
        var userIdString = userId.ToString();
        
        // Obtener las relaciones survey-subject que aplican al usuario
        var surveySubjectIds = await (from surveySubject in db.AcademicSurveySubjects
                                      join subject in db.Subjects on surveySubject.SubjectId equals subject.Id
                                      join survey in db.AcademicSurveys on surveySubject.AcademicSurveyId equals survey.Id
                                      where survey.IsActive && surveySubject.IsActive && subject.IsActive
                                      && (survey.Status == SurveyStatus.Published || survey.Status == SurveyStatus.Closed)
                                      && (
                                          // Usuario es estudiante matriculado en la asignatura
                                          subject.StudentSubjects!.Any(ss => ss.StudentId == userIdString) ||
                                          // Usuario es profesor de la asignatura
                                          subject.ProfessorId == userIdString
                                      )
                                      select surveySubject.Id).ToListAsync(ct);

        if (!surveySubjectIds.Any())
        {
            return new List<(AcademicSurvey Survey, AcademicSurveySubject SurveySubject, bool HasResponded, DateTime? RespondedAt)>();
        }

        // Cargar las entidades completas con includes
        var surveySubjects = await db.AcademicSurveySubjects
            .Where(ss => surveySubjectIds.Contains(ss.Id))
            .Include(ss => ss.AcademicSurvey!)
                .ThenInclude(s => s.Questions)
            .Include(ss => ss.AcademicSurvey!)
            .ToListAsync(ct);

        var userSurveysWithResponse = new List<(AcademicSurvey Survey, AcademicSurveySubject SurveySubject, bool HasResponded, DateTime? RespondedAt)>();

        foreach (var surveySubject in surveySubjects)
        {
            // Verificar si el usuario ya respondió esta encuesta en esta asignatura
            var response = await db.AcademicSurveyResponses
                .Where(r => r.AcademicSurveySubjectId == surveySubject.Id && r.UserId == userIdString)
                .FirstOrDefaultAsync(ct);

            userSurveysWithResponse.Add((
                Survey: surveySubject.AcademicSurvey!,
                SurveySubject: surveySubject,
                HasResponded: response != null,
                RespondedAt: response?.SubmittedAt
            ));
        }

        return userSurveysWithResponse;
    }

    public async Task<IEnumerable<(AcademicSurveySubject SurveySubject, bool HasResponded, DateTime? RespondedAt)>> GetSurveySubjectsForUserAsync(Guid surveyId, string userId, CancellationToken ct = default)
    {
 // Primero obtenemos los SurveySubjects con sus relaciones
        var surveySubjects = await db.AcademicSurveySubjects
            .Where(subject => subject.AcademicSurveyId == surveyId && 
                             subject.Subject != null &&
                             subject.Subject.StudentSubjects != null &&
                             subject.Subject.StudentSubjects.Any(ss => ss.StudentId == userId))
            .Include(x => x.Subject)
            .Include(x => x.Subject.Professor)
            .ThenInclude(p => p.User)
            .Include(x => x.AcademicSurvey)
            .ThenInclude(s => s.Questions)
            .ToListAsync(ct);

        // Después obtenemos las respuestas del usuario para estos survey subjects
        var surveySubjectIds = surveySubjects.Select(s => s.Id).ToList();
        var userResponses = await db.AcademicSurveyResponses
            .Where(r => r.UserId == userId && r.AcademicSurveySubjectId.HasValue && surveySubjectIds.Contains(r.AcademicSurveySubjectId.Value))
            .ToListAsync(ct);

        // Combinamos los datos en memoria
        var results = surveySubjects.Select(subject =>
        {
            var response = userResponses.FirstOrDefault(r => r.AcademicSurveySubjectId.HasValue && r.AcademicSurveySubjectId.Value == subject.Id);
            return (
                SurveySubject: subject,
                HasResponded: response != null,
                RespondedAt: response?.SubmittedAt
            );
        });

        return results;
    }

    public async Task<Guid> CreateWithQuestionsAsync(string title, string description, List<object> questions, DateTime? publishAt, DateTime? closeAt, string? userId = null, CancellationToken ct = default)
    {
        // Determinar estado inicial basado en fechas
        var now = DateTime.UtcNow;
        var initialStatus = SurveyStatus.Draft;
        if (publishAt.HasValue && publishAt.Value <= now)
        {
            initialStatus = SurveyStatus.Published;
            if (closeAt.HasValue && closeAt.Value <= now)
            {
                initialStatus = SurveyStatus.Closed;
            }
        }

        // Crear encuesta (completamente independiente)
        var survey = new AcademicSurvey
        {
            Title = title,
            Description = description,
            PublishAt = publishAt,
            CloseAt = closeAt,
            Status = initialStatus,
            CreatedByUserId = userId
        };

        // Crear preguntas desde el DTO (ya procesadas por el frontend)
        foreach (var qObj in questions)
        {
            var q = (SurveyQuestionDto)qObj;
            Console.WriteLine($"🔍 Debug Repository - Processing question from DTO: Text={q.Text}, AllowComment={q.AllowComment}");
            var sq = new SurveyQuestion
            {
                Text = q.Text,
                Type = (QuestionType)q.Type,
                Order = q.Order,
                IsRequired = q.IsRequired,
                AllowComment = q.AllowComment,
                AcademicSurveyId = survey.Id,
                CreatedByUserId = userId,
                CreatedAt = now,
            };

            foreach (var o in q.Options.OrderBy(o => o.Order))
            {
                sq.Options.Add(new SurveyQuestionOption
                {
                    Text = o.Text,
                    Value = o.Value,
                    Order = o.Order,
                    AllowOpenText = o.AllowOpenText,
                    SurveyQuestionId = sq.Id,
                    CreatedByUserId = userId,
                    CreatedAt = now,
                });
            }
            survey.Questions.Add(sq);
        }

        db.AcademicSurveys.Add(survey);
        await db.SaveChangesAsync(ct);

        return survey.Id;
    }
}