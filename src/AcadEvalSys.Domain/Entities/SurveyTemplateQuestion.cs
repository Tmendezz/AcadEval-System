using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class SurveyTemplateQuestion : BaseEntity
    {
        public Guid TemplateId { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public int? Order { get; set; } 
        public bool isRequired { get; set; } = false;
        public bool AllowComment { get; set; } = false;

        public virtual SurveyTemplate? SurveyTemplate { get; set; }
        public virtual ICollection<SurveyTemplateQuestionOption> Options { get; set; } = new List<SurveyTemplateQuestionOption>();

    }
}
