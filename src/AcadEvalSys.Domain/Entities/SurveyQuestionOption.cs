namespace AcadEvalSys.Domain.Entities
{
    public class SurveyQuestionOption : BaseEntity
    {
        public Guid SurveyQuestionId { get; set; }
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
        public int? Order { get; set; }
        public bool AllowOpenText { get; set; }

        public virtual SurveyQuestion? SurveyQuestion { get; set; }
    }
}