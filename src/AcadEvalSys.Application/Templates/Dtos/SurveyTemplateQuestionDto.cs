using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateQuestionDto
    {
        public Guid? Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public int Order { get; set; }
        public bool Required { get; set; }
        public List<SurveyTemplateOptionDto> Options { get; set; } = new();
    }
}
