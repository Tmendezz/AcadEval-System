using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommand : IRequest<Guid>
    {
        public string Title { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
        public List<SurveyAudienceDto> Audience { get; set; } = new();
    }
    
    public class SurveyAudienceDto
    {
        public Guid TechnicalCareerId { get; set; }
        public List<CareerYear> SelectedYears { get; set; } = new();
    }
}
