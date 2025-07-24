using System;
using System.Collections.Generic;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class Subject : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Guid? TechnicalCareerId { get; set; }
        public CareerYear Year { get; set; }
        public string? ProfessorId { get; set; }

        public virtual TechnicalCareer? TechnicalCareer { get; set; }
        public virtual Professor? Professor { get; set; }
        public virtual ICollection<StudentSubject>? StudentSubjects { get; set; } = new List<StudentSubject>();
        public virtual ICollection<StudentCompetencyAssessment>? StudentCompetencyAssessments { get; set; } = new List<StudentCompetencyAssessment>();
        public virtual ICollection<ProfessorCompetencyAssignment>? ProfessorCompetencyAssignments { get; set; } = new List<ProfessorCompetencyAssignment>();
    }
}
