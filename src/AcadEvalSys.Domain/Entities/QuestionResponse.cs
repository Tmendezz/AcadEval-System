using System;

namespace AcadEvalSys.Domain.Entities
{
    public class QuestionResponse : BaseEntity
    {
        public Guid? FormQuestionId { get; set; }
        public Guid? StudentCompetencyEvaluationId { get; set; }
        public int ResponseValue { get; set; }
        public string? Comments { get; set; }

        // Navigation properties
        public virtual FormQuestion? FormQuestion { get; set; }
    }
}
