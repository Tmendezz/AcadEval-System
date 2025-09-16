using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;
using System.Text.Json.Serialization;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommand : IRequest<Guid> 
    {
        [JsonIgnore]
        public Guid AcademicSurveySubjectId { get; set; }
        [JsonIgnore]
        public string UserId { get; set; } = string.Empty;
        public IList<SubmitSurveyAnswerDto> Answers { get; set; } = new List<SubmitSurveyAnswerDto>();
    }
}
