using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentRepository
{
    Task<IEnumerable<Student>> GetAllAsync();
    Task<Student?> GetByIdAsync(string id);
    Task<Student?> GetByIdWithDetailsAsync(string id);
    Task CreateAsync(Student student);
    Task UpdateAsync(Student student);
    Task DeleteAsync(string id);
    Task<Student?> GetForReportGenerationAsync(string id);
    Task<bool> ExistsAsync(string studentId);
    Task<bool> IsEnrolledInSubjectAsync(string studentId, Guid subjectId);
    Task EnrollInSubjectAsync(string studentId, Guid subjectId);
    Task UnenrollFromSubjectAsync(string studentId, Guid subjectId);
}
