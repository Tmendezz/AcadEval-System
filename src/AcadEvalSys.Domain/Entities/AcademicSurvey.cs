namespace AcadEvalSys.Domain.Entities
{
    public class AcademicSurvey : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set;} = DateTime.UtcNow;

        //FK a QuestionForm
        public Guid FormId { get; set; }
        //FK a Subject
        public Guid SubjectId { get; set; }
        //FK a Professor
        public Guid ProfessorId { get; set; }

    }
}
