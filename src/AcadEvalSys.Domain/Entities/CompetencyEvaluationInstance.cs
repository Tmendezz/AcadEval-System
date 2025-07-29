using System;
using System.Collections.Generic;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class CompetencyEvaluationInstance : BaseEntity
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime PeriodFrom { get; set; }
        public DateTime PeriodTo { get; set; }
        public EvaluationStatus Status { get; set; } = EvaluationStatus.Pending;
        public Semester Semester { get; set; } = Semester.First;

        public int TotalProfessorAssignmentsCount => ProfessorCompetencyAssignments.Count();
        public int CompletedProfessorAssignmentsCount => ProfessorCompetencyAssignments.Count(pca => pca.Status == ProfessorAssignmentStatus.Completed);
        public decimal OverallProgressPercentage => TotalProfessorAssignmentsCount > 0 ? (decimal)CompletedProfessorAssignmentsCount / TotalProfessorAssignmentsCount * 100 : 0;

        public virtual ICollection<ProfessorCompetencyAssignment>? ProfessorCompetencyAssignments { get; set; } = new List<ProfessorCompetencyAssignment>();
        public virtual ICollection<StudentEvaluationReport>? StudentEvaluationReports { get; set; } = new List<StudentEvaluationReport>();

        public virtual ICollection<TechnicalCareer> TechnicalCareers { get; set; } = new List<TechnicalCareer>();
    }
}