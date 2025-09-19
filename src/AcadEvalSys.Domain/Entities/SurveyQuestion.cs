using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class SurveyQuestion : BaseEntity
    {
        public Guid AcademicSurveyId { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public int? Order { get; set; }
        public bool IsRequired { get; set; }
        public bool AllowComment { get; set; } = false;

        public virtual AcademicSurvey? AcademicSurvey { get; set; }
        public virtual ICollection<SurveyQuestionOption> Options { get; set; } = new List<SurveyQuestionOption>();
    }
}