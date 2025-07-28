using System;
using System.Collections.Generic;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class StudentCompetencyAssessment : BaseEntity
    {
        public string? StudentId { get; set; }
        public Guid ProfessorCompetencyAssignmentId { get; set; }
        public AssessmentStatus? Status { get; set; } = AssessmentStatus.Pending;
        public CompetencyLevel CompetencyLevel { get; set; }
        public DateTime? CompletedAt { get; set; }

        public virtual Student? Student { get; set; }
        public virtual ProfessorCompetencyAssignment? ProfessorCompetencyAssignment { get; set; }
    }
}