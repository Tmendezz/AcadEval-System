using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface IAcademicSurveyRepository
{
    Task<Guid> CreateAsync(AcademicSurvey survey, CancellationToken ct = default);
    
    Task ConfigureSurveyAudienceAsync(Guid surveyId, IEnumerable<(Guid TechnicalCareerId, IEnumerable<CareerYear> SelectedYears)> audience, CancellationToken ct = default);

    Task ReplaceSurveyAudienceAsync(Guid surveyId,
        IEnumerable<(Guid TechnicalCareerId, IEnumerable<CareerYear> SelectedYears)> audience,
        CancellationToken ct = default);
    
    Task CloseAsync(Guid surveyId, CancellationToken ct = default);

    Task<AcademicSurvey?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task UpdateAsync(AcademicSurvey survey, CancellationToken ct = default);
    Task<IReadOnlyList<AcademicSurvey>> GetAllAsync(
        SurveyStatus? status = null,
        string? search = null,
        CancellationToken ct = default);

    Task<bool> ExistsTitleAsync(string title, Guid? excludingId = null, CancellationToken ct = default);

    Task ReplaceSurveyQuestionsAsync(Guid surveyId, IEnumerable<SurveyQuestion> questions, CancellationToken ct = default);

  
    Task<AcademicSurvey?> GetSurveyWithSubjectsAsync(Guid surveyId, CancellationToken ct = default);
    Task<IReadOnlyList<AcademicSurveySubject>> GetAudienceSurveySubjectsAsync(
        Guid surveyId,
        Guid technicalCareerId,
        CareerYear year,
        CancellationToken ct = default);

    Task DeleteAsync(Guid surveyId, CancellationToken ct = default);

}
