using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IProfessorCompetencyAssignmentRepository
{
    Task<Guid> CreateAsync(ProfessorCompetencyAssignment assignment);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null);
    Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id);
    Task UpdateAsync(ProfessorCompetencyAssignment assignment);
}
