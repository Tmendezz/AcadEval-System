using System;

namespace AcadEvalSys.Domain.Entities
{
    public class QuestionResponse : BaseEntity
    {
        public DateTime SubmittedAt { get; set; }

        public string ObservationText { get; set; } = string.Empty;

        //Campo de Observaciones
        public bool? ObservationIsVisible { get; set; } = false;

        //FK a FormQuestion
        public Guid? FormQuestionId { get; set; }
        //FK a Subject
        public Guid? SubjectId { get; set; }
        //FK a Professor
        public Guid ProfessorId { get; set; }

        // Navigation properties
        public virtual FormQuestion? FormQuestion { get; set; }
    }
}
