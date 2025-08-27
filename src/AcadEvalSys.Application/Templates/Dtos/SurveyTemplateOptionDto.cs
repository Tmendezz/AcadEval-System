namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateOptionDto
    {
        public Guid? Id { get; set; }
        public string Value { get; set; }
        public string Text { get; set; }
        public int Order { get; set; }
        public bool AllowOpenText { get; set; }
    }
}
