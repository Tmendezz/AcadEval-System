using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsByAudience;

public class GetSurveySubjectsByAudienceQuery : IRequest<IEnumerable<SurveySubjectDto>>
{
    public Guid SurveyId { get; set; }
    public string TechnicalCareerName { get; set; } = string.Empty;
    public int Year { get; set; }
}


