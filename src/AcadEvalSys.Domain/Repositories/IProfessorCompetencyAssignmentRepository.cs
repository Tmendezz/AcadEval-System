using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface IProfessorCompetencyAssignmentRepository
{
    Task<Guid> CreateAsync(ProfessorCompetencyAssignment assignment);
    Task UpdateAsync(ProfessorCompetencyAssignment assignment);
    
    Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id);
    Task<ProfessorCompetencyAssignment?> GetAssignmentByIdAsync(Guid id);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null);
    Task DeleteAsync(Guid id);
    Task DeleteByCompetenciesEvaluationInstanceIdAsync(Guid competenciesEvaluationInstanceId);
    Task<ProfessorCompetencyAssignment?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetByProfessorAsync(string professorId);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetByEvaluationInstanceAsync(Guid evaluationInstanceId);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetByEvaluationInstanceWithDetailsAsync(Guid evaluationInstanceId);
}
