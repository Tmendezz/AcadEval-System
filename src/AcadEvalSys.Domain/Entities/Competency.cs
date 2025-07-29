using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class Competency : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CompetencyType Type { get; set; }

        public virtual ICollection<FormQuestion>? FormQuestions { get; set; } = new List<FormQuestion>();
        public virtual ICollection<ProfessorCompetencyAssignment>? ProfessorCompetencyAssignments { get; set; } = new List<ProfessorCompetencyAssignment>();
        public virtual ICollection<CompetencyLevelDescription>? LevelDescriptions { get; set; } = new List<CompetencyLevelDescription>();
    }
}
