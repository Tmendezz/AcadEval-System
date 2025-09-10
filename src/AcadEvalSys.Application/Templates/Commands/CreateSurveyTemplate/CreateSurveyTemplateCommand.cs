using AcadEvalSys.Application.Templates.Dtos;
using MediatR;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Commands.CreateTemplate
{
    public class CreateSurveyTemplateCommand : IRequest<Guid>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public List<SurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
