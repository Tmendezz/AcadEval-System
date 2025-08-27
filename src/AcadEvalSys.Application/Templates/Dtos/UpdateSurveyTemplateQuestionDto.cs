namespace AcadEvalSys.Application.Templates.Dtos
{
    public class UpdateSurveyTemplateQuestionDto
    {
        public Guid? Id { get; set; } // Null para nuevas preguntas
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // text, single_choice, multiple_choice, etc.
        public int Order { get; set; }
        public bool IsRequired { get; set; } = true;
        public List<UpdateSurveyTemplateQuestionOptionDto> Options { get; set; } = new();
    }
}
