using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyResponses
{
    public class GetSurveyResponsesQuery : IRequest<SurveyResponsesOverviewDto>
    {
        public Guid SurveyId { get; set; }

        public GetSurveyResponsesQuery() { }

        public GetSurveyResponsesQuery(Guid surveyId)
        {
            SurveyId = surveyId;
        }
    }
}
