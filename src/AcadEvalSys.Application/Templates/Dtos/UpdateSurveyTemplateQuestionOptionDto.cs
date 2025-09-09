namespace AcadEvalSys.Application.Templates.Dtos
{
    public class UpdateSurveyTemplateQuestionOptionDto
    {
        public Guid? Id { get; set; } // Null para nuevas opciones
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
