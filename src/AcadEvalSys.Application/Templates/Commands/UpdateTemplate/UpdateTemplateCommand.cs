using AcadEvalSys.Application.Templates.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;
using System.Text.Json.Serialization;

namespace AcadEvalSys.Application.Templates.Commands.UpdateTemplate
{
    public class UpdateSurveyTemplateCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public List<UpdateSurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
