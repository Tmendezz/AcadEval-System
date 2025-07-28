using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentEvaluationReportRepository
{
    Task<StudentEvaluationReport> CreateAsync(StudentEvaluationReport report);
    Task<StudentEvaluationReport?> GetByIdAsync(Guid reportId);
    Task<IEnumerable<StudentEvaluationReport>> GetByStudentIdAsync(string studentId);
    Task<IEnumerable<StudentEvaluationReport>> GetByInstanceIdAsync(Guid evaluationInstanceId);
    Task UpdateAsync(StudentEvaluationReport report);
    Task DeleteAsync(Guid reportId);
}
