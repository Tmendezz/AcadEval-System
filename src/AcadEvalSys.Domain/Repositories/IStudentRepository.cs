using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IStudentRepository
{
    Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, Guid? technicalCareerId = null, AcadEvalSys.Domain.Enums.CareerYear? currentYear = null);
    Task<Student?> GetByIdAsync(string studentId);
    Task<Student?> GetByUserIdAsync(string userId);
    Task CreateAsync(Student student);
    Task UpdateAsync(Student student);
    Task DeleteAsync(string id);
    
    // Métodos para enrollment en materias
    Task<bool> IsEnrolledInSubjectAsync(string studentId, Guid subjectId);
    Task EnrollInSubjectAsync(string studentId, Guid subjectId, string createdByUserId);
    Task UpdateStudentYearIfNeededAsync(string studentId, AcadEvalSys.Domain.Enums.CareerYear subjectYear);
    Task UnenrollFromSubjectAsync(string studentId, Guid subjectId);
    Task<IEnumerable<Student>> GetAvailableStudentsForSubjectAsync(Guid technicalCareerId, Guid subjectId, AcadEvalSys.Domain.Enums.CareerYear? year = null);
}
