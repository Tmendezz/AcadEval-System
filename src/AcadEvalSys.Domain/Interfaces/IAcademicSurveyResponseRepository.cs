using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Interfaces;

public interface IAcademicSurveyResponseRepository
{
        Task<IEnumerable<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>>
        GetAssignedSurveysForStudentAsync(
            string userId,
            string? status = null,
            CancellationToken ct = default);
        
        Task<IEnumerable<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)>> GetAssignedSurveysForProfessorAsync(
                string userId,
                string? status = null,
                CancellationToken ct = default);

        Task<AcademicSurveyResponse?> GetResponseBySurveyAndUserAsync(
            Guid surveyId,
            string userId,
            CancellationToken ct = default);

        Task<Guid> CreateResponseAsync(
            AcademicSurveyResponse response,
            CancellationToken ct = default);

        Task<bool> HasUserRespondedToSurveyAsync(
            Guid surveyId,
            string userId,
            CancellationToken ct = default);

        // Analytics helpers
        Task<int> CountResponsesBySurveySubjectsAsync(
            IEnumerable<Guid> surveySubjectIds,
            CancellationToken ct = default);

        Task<IReadOnlyList<AcademicSurveyResponse>> GetResponsesBySurveySubjectsAsync(
            IEnumerable<Guid> surveySubjectIds,
            CancellationToken ct = default);
}