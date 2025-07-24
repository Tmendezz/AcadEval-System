using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentEvaluationReportRepository
{
    Task<StudentEvaluationReport> CreateAsync(StudentEvaluationReport report);
    Task<StudentEvaluationReport?> GetByStudentAndInstanceAsync(string studentId, Guid evaluationInstanceId);
    Task<IEnumerable<StudentEvaluationReport>> GetByStudentIdAsync(string studentId);
    Task<IEnumerable<StudentEvaluationReport>> GetByInstanceIdAsync(Guid evaluationInstanceId);
    Task UpdateAsync(StudentEvaluationReport report);
    Task DeleteAsync(Guid reportId);
    Task<StudentEvaluationReport?> GetByIdAsync(Guid reportId);
}
