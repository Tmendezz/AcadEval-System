using System.Collections.Generic;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class ProfessorCompetencyAssignment : BaseEntity
    {
        public Guid CompetencyEvaluationInstanceId { get; set; }
        public Guid CompetencyId { get; set; }
        public Guid SubjectId { get; set; }
        public ProfessorAssignmentStatus Status { get; set; } = ProfessorAssignmentStatus.Pending;
        
        // Progress tracking properties
        public int TotalStudentsCount => Subject?.StudentSubjects?.Count() ?? 0;
        public int EvaluatedStudentsCount => StudentCompetencyAssessments?.Count(sca => sca.Status == AssessmentStatus.Completed) ?? 0;
        public decimal ProgressPercentage => TotalStudentsCount > 0 ? (decimal)EvaluatedStudentsCount / TotalStudentsCount * 100 : 0;

        public virtual CompetencyEvaluationInstance? CompetencyEvaluationInstance { get; set; }
        public virtual Competency? Competency { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual ICollection<StudentCompetencyAssessment>? StudentCompetencyAssessments { get; set; } = new List<StudentCompetencyAssessment>();
    }
}
