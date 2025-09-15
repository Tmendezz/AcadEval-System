using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectResponses
{
    public class GetSurveySubjectResponsesQuery : IRequest<SurveySubjectResponsesDto>
    {
        public Guid SurveySubjectId { get; set; }

        public GetSurveySubjectResponsesQuery() { }

        public GetSurveySubjectResponsesQuery(Guid surveySubjectId)
        {
            SurveySubjectId = surveySubjectId;
        }
    }
}
