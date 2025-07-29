using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentCompetencyAssessmentsRepository
{
    Task<StudentCompetencyAssessment?> GetByStudentAndAssignmentAsync(string studentId, Guid professorCompetencyAssignmentId);
    Task<StudentCompetencyAssessment?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId);
    Task<IEnumerable<StudentCompetencyAssessment>> GetByAssignmentAsync(Guid professorCompetencyAssignmentId);
    Task UpdateAsync(StudentCompetencyAssessment assessment);
    Task<IEnumerable<StudentCompetencyAssessment>> GetCompletedByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId);
}
