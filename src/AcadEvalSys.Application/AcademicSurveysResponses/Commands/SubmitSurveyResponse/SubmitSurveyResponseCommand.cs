using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;
using System.Text.Json.Serialization;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommand : IRequest<Guid> 
    {
        [JsonIgnore]
        public Guid SurveyId { get; set; }
        public IList<SubmitSurveyAnswerDto> Answers { get; set; } = new List<SubmitSurveyAnswerDto>();
    }
}
