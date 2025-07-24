using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentCompetencyAssessmentsRepository
{
    Task<StudentCompetencyAssessment?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId);
    Task<StudentCompetencyAssessment?> GetByStudentAndAssignmentAsync(string studentId, Guid professorCompetencyAssignmentId);
    Task<IEnumerable<StudentCompetencyAssessment>> GetByEvaluationInstanceAsync(Guid evaluationInstanceId);
    Task<IEnumerable<StudentCompetencyAssessment>> GetByAssignmentAsync(Guid professorCompetencyAssignmentId);
    Task UpdateAsync(StudentCompetencyAssessment assessment);
}
