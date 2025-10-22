namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateOptionDto
    {
        public Guid? Id { get; set; }
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool AllowOpenText { get; set; }
    }
}
