namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateOptionDto
    {
        public Guid? Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool AllowOpenText { get; set; }
    }
}
