using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class AcademicSurveyResponseRepository(ApplicationDbContext db) : IAcademicSurveyResponseRepository
{
    public async Task<IEnumerable<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>> GetAssignedSurveysForStudentAsync(string userId, string? status = null, CancellationToken ct = default)
    {
        var student = await db.Students
            .Include(s => s.StudentSubjects)
            .FirstOrDefaultAsync(s => s.UserId == userId, ct);

        if (student?.StudentSubjects == null)
            return Enumerable.Empty<(AcademicSurvey, bool, DateTime?)>();

        var studentSubjectIds = student.StudentSubjects
            .Where(ss => ss.SubjectId.HasValue)
            .Select(ss => ss.SubjectId!.Value)
            .ToList();

        if (!studentSubjectIds.Any())
            return Enumerable.Empty<(AcademicSurvey, bool, DateTime?)>();


        var query = db.AcademicSurveys
            .Include(s => s.Subjects)
            .Where(s => 
                s.Status == SurveyStatus.Published && 
                s.Subjects.Any(ass => studentSubjectIds.Contains(ass.SubjectId!.Value)));

        // Filtrar por estado si se proporciona
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<SurveyStatus>(status, true, out var surveyStatus))
            {
                query = query.Where(s => s.Status == surveyStatus);
            }
        }

        var surveys = await query.ToListAsync(ct);
        var result = new List<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>();

        foreach (var survey in surveys)
        {
            var surveySubjectIds = survey.Subjects.Select(s => s.Id).ToList();
            var response = await db.AcademicSurveyResponses
                .FirstOrDefaultAsync(r => r.UserId == userId && 
                                         r.AcademicSurveySubjectId.HasValue &&
                                         surveySubjectIds.Contains(r.AcademicSurveySubjectId.Value), ct);

            result.Add((survey, response != null, response?.SubmittedAt));
        }

        return result;
    }

    public async Task<IEnumerable<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>> GetAssignedSurveysForProfessorAsync(string userId, string? status = null, CancellationToken ct = default)
    {
        var professor = await db.Professors
            .Include(p => p.Subjects)
            .FirstOrDefaultAsync(p => p.UserId == userId, ct);

        if (professor == null)
            return Enumerable.Empty<(AcademicSurvey, bool, DateTime?)>();

        var professorSubjectIds = professor.Subjects?.Select(s => s.Id).ToList() ?? new List<Guid>();

        var query = db.AcademicSurveys
            .Include(s => s.Subjects)
            .Where(s => 
                s.Status == SurveyStatus.Published && 
                s.Subjects.Any(ass => professorSubjectIds.Contains(ass.SubjectId!.Value)));

        // Filtrar por estado si se proporciona
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<SurveyStatus>(status, true, out var surveyStatus))
            {
                query = query.Where(s => s.Status == surveyStatus);
            }
        }

        var surveys = await query.ToListAsync(ct);

        var result = new List<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>();

        foreach (var survey in surveys)
        {
            var surveySubjectIds = survey.Subjects.Select(s => s.Id).ToList();
            var response = await db.AcademicSurveyResponses
                .FirstOrDefaultAsync(r => r.UserId == userId && 
                                         r.AcademicSurveySubjectId.HasValue &&
                                         surveySubjectIds.Contains(r.AcademicSurveySubjectId.Value), ct);

            result.Add((survey, response != null, response?.SubmittedAt));
        }

        return result;
    }

    public async Task<AcademicSurveyResponse?> GetResponseBySurveyAndUserAsync(Guid surveyId, string userId, CancellationToken ct = default)
    {
        return await db.AcademicSurveyResponses
            .Include(r => r.QuestionResponses)
            .FirstOrDefaultAsync(r => r.AcademicSurveySubjectId == surveyId && r.UserId == userId, ct);
    }

    public async Task<Guid> CreateResponseAsync(AcademicSurveyResponse response, CancellationToken ct = default)
    {
        db.AcademicSurveyResponses.Add(response);
        await db.SaveChangesAsync(ct);
        return response.Id;
    }

    public async Task<bool> HasUserRespondedToSurveyAsync(Guid surveyId, string userId, CancellationToken ct = default)
    {
        return await db.AcademicSurveyResponses
            .AnyAsync(r => r.AcademicSurveySubjectId == surveyId && r.UserId == userId, ct);
    }

    // ------------------- Analytics helpers -------------------
    public async Task<int> CountResponsesBySurveySubjectsAsync(IEnumerable<Guid> surveySubjectIds, CancellationToken ct = default)
    {
        var ids = surveySubjectIds.ToList();
        if (!ids.Any()) return 0;
        return await db.AcademicSurveyResponses
            .CountAsync(r => r.AcademicSurveySubjectId != null && ids.Contains(r.AcademicSurveySubjectId!.Value), ct);
    }

    public async Task<IReadOnlyList<AcademicSurveyResponse>> GetResponsesBySurveySubjectsAsync(IEnumerable<Guid> surveySubjectIds, CancellationToken ct = default)
    {
        var ids = surveySubjectIds.ToList();
        if (!ids.Any()) return new List<AcademicSurveyResponse>();
        return await db.AcademicSurveyResponses
            .Where(r => r.AcademicSurveySubjectId != null && ids.Contains(r.AcademicSurveySubjectId!.Value))
            .Include(r => r.QuestionResponses)
                .ThenInclude(qr => qr.SurveyQuestion)
            .ToListAsync(ct);
    }
}