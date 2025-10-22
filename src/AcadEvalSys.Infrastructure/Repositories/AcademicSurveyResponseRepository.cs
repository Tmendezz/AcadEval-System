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
                (s.SurveyType == SurveyType.Student || s.SurveyType == SurveyType.All) &&
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
                (s.SurveyType == SurveyType.Professor || s.SurveyType == SurveyType.All) &&
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

    public async Task<IReadOnlyList<(Guid SurveySubjectId, Guid? SubjectId, string SubjectName, string? ProfessorId, string ProfessorName, int QuestionsCount, bool HasResponded, string CareerYear)>> GetSurveySubjectsForUserAsync(Guid surveyId, string userId, CancellationToken ct = default)
    {
        // Cargar encuesta con subjects y preguntas
        var survey = await db.AcademicSurveys
            .Include(s => s.Subjects)
            .Include(s => s.Questions)
            .FirstOrDefaultAsync(s => s.Id == surveyId, ct);

        if (survey == null || survey.Subjects == null)
            return new List<(Guid, Guid?, string, string?, string, int, bool, string)>();

        // Determinar materias a las que el usuario tiene acceso según su rol/asignaciones
        var student = await db.Students
            .Include(s => s.StudentSubjects)
            .FirstOrDefaultAsync(s => s.UserId == userId, ct);

        var professor = await db.Professors
            .Include(p => p.Subjects)
            .FirstOrDefaultAsync(p => p.UserId == userId, ct);

        var allowedSubjectIds = new HashSet<Guid>();
        if (student?.StudentSubjects != null)
        {
            foreach (var ss in student.StudentSubjects)
            {
                if (ss.SubjectId.HasValue) allowedSubjectIds.Add(ss.SubjectId.Value);
            }
        }
        if (professor?.Subjects != null)
        {
            foreach (var ps in professor.Subjects)
            {
                allowedSubjectIds.Add(ps.Id);
            }
        }

        // Filtrar los survey-subjects sólo a los que el usuario tiene acceso
        var filteredSurveySubjects = survey.Subjects
            .Where(x => x.SubjectId.HasValue && allowedSubjectIds.Contains(x.SubjectId.Value))
            .ToList();

        var subjectIds = filteredSurveySubjects.Where(x => x.SubjectId.HasValue).Select(x => x.SubjectId!.Value).ToList();
        var subjects = await db.Subjects
            .Where(s => subjectIds.Contains(s.Id))
            .Include(s => s.Professor)
                .ThenInclude(p => p!.User)
            .ToListAsync(ct);

        // Determinar si el usuario ya respondió por subject
        var subjectEntryIds = filteredSurveySubjects.Select(s => s.Id).ToList();
        var responses = await db.AcademicSurveyResponses
            .Where(r => r.UserId == userId && r.AcademicSurveySubjectId != null && subjectEntryIds.Contains(r.AcademicSurveySubjectId!.Value))
            .ToListAsync(ct);

        var results = new List<(Guid, Guid?, string, string?, string, int, bool, string)>();
        foreach (var ass in filteredSurveySubjects)
        {
            var subj = ass.SubjectId.HasValue ? subjects.FirstOrDefault(s => s.Id == ass.SubjectId.Value) : null;
            var hasResponded = responses.Any(r => r.AcademicSurveySubjectId == ass.Id);
            var subjectName = subj?.Name ?? "";
            var professorId = subj?.ProfessorId;
            var professorName = subj?.Professor?.User?.Name ?? string.Empty;
            var questionsCount = survey.Questions?.Count ?? 0;
            var careerYear = subj != null ? ((int)subj.Year).ToString() : string.Empty;
            results.Add((ass.Id, ass.SubjectId, subjectName, professorId, professorName, questionsCount, hasResponded, careerYear));
        }

        return results;
    }
}