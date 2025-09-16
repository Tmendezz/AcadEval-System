using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    /// <summary>
    /// Define la audiencia de una encuesta (por carrera, año y/o materia/profesor).
    /// Cualquier combinación puede ser null para soportar targets amplios o específicos.
    /// </summary>
    public class AcademicSurveySubject : BaseEntity
    {
        public Guid AcademicSurveyId { get; set; }
        public Guid? SubjectId { get; set; }           // Materia específica

        // Navegación
        public virtual AcademicSurvey? AcademicSurvey { get; set; }
        public virtual Subject? Subject { get; set; }

        public virtual ICollection<AcademicSurveyResponse> Responses { get; set; } = new List<AcademicSurveyResponse>();
    }
}
