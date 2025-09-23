using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAudienceResponses;

public class GetSurveyAudienceResponsesQuery(Guid surveyId, Guid careerId, CareerYear year)
    : IRequest<AudienceResponsesDto>
{
    public Guid SurveyId { get; } = surveyId;
    public Guid CareerId { get; } = careerId;
    public CareerYear Year { get; } = year;
}


