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
        
        // Configuración de audiencia
        public List<Guid> SelectedCareerIds { get; set; } = new();
        public List<CareerYear> SelectedYears { get; set; } = new();
    }
}
