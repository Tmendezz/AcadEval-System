namespace AcadEvalSys.Domain.Entities
{
    public class SurveyTemplate : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public virtual ICollection<SurveyTemplateQuestion> Questions { get; set; } = new List<SurveyTemplateQuestion>();

    }
}
