using System;
using System.Collections.Generic;
using System.Linq;

namespace AcadEvalSys.Domain.Entities
{
    public class TechnicalCareer : BaseEntity
    {
        public string? Name { get; set; }


        public virtual ICollection<Subject>? Subjects { get; set; } = new List<Subject>();
        public virtual ICollection<ProfessorCompetencyAssignment>? ProfessorCompetencyAssignments { get; set; } = new List<ProfessorCompetencyAssignment>();
        public virtual ICollection<Coordinator>? Coordinators { get; set; } = new List<Coordinator>();
     
        public virtual ICollection<Student>? Students { get; set; } = new List<Student>();


        public virtual ICollection<CompetencyEvaluationInstance> CompetencyEvaluationInstances { get; set; } = new List<CompetencyEvaluationInstance>();
    }
}
