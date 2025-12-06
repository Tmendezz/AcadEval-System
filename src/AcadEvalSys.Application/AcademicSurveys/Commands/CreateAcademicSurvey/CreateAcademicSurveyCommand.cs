using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommand : IRequest<Guid>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PublishAt { get; set; } 
        public DateTime CloseAt { get; set; }
        public List<CreateSurveyAudienceDto> Audience { get; set; } = new();
        public List<SurveyQuestionDto> Questions { get; set; } = new();
    }
}
