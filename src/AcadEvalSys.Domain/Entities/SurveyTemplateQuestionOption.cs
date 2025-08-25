namespace AcadEvalSys.Domain.Entities
{
    public class SurveyTemplateQuestionOption : BaseEntity
    {
        public Guid TemplateQuestionId { get; set; }
        public int Value { get; set; } 
        public string Text { get; set; } = string.Empty;
        public int? Order { get; set; }
        public bool AllowOpenText { get; set; } = false;
        public virtual SurveyTemplateQuestion? SurveyTemplateQuestion { get; set; }
    }
}
