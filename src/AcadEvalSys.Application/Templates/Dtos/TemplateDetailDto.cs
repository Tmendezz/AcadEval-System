using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class TemplateDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public SurveyType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public int Version { get; set; }
        public List<TemplateQuestionDto> Questions { get; set; } = new();
    }
}
