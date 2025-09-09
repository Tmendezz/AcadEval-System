using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommand : IRequest<Guid> 
    { 
        public Guid AcademicSurveySubjectId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public IList<SubmitSurveyAnswerDto> Answers { get; set; } = new List<SubmitSurveyAnswerDto>(); 
    }
}
