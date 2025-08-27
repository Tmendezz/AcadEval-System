namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateQuestionDto
    {
        public Guid? Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool Required { get; set; }
        public List<SurveyTemplateOptionDto> Options { get; set; } = new();
    }
}
