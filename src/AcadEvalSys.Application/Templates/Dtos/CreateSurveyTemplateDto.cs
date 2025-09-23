using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class CreateSurveyTemplateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SurveyType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public List<SurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
