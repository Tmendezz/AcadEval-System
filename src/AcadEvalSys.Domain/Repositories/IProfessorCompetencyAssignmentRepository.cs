using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface IProfessorCompetencyAssignmentRepository
{
    Task<Guid> CreateAsync(ProfessorCompetencyAssignment assignment);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetProfessorAssignmentsAsync(string professorId, Guid? evaluationInstanceId = null);
    Task<ProfessorCompetencyAssignment?> GetByIdAsync(Guid id);
    Task UpdateAsync(ProfessorCompetencyAssignment assignment);
    Task<IEnumerable<ProfessorCompetencyAssignment>> GetCareerYearAssignmentDetailsAsync(
        Guid evaluationId, 
        Guid careerId, 
        CareerYear year, 
        CancellationToken cancellationToken = default);
        
    Task<IEnumerable<StudentCompetencyAssessment>> GetAssignmentStudentsAsync(
        Guid assignmentId, 
        CancellationToken cancellationToken = default);
}
