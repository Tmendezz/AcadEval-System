using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class CreateSurveyTemplateDto
    {
        public string Name { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public List<SurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
