namespace AcadEvalSys.Domain.Entities
{
    public class SurveyTemplateQuestionOption : BaseEntity
    {
        public Guid TemplateQuestionId { get; set; }
        public int Value { get; set; }
        public string Text { get; set; }
    }
}
