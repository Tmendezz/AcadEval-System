using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAnalyticsById;

public class GetSurveyAnalyticsByIdQuery(Guid surveyId) : IRequest<SurveyAnalyticsDto>
{
    public Guid SurveyId { get; } = surveyId;
}


