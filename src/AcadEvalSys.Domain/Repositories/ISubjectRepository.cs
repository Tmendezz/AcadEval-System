using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface ISubjectRepository
{
    Task<Guid> CreateSubjectAsync(Subject subject);
    Task<Subject?> GetSubjectByIdAsync(Guid id);
    Task<IEnumerable<Subject>> GetAllSubjectsAsync();
    Task<IEnumerable<Subject>> GetSubjectsByCareerAsync(Guid technicalCareerId);
    Task<IEnumerable<Subject>> GetSubjectsByProfessorAsync(string professorId);
    Task UpdateSubjectAsync(Subject subject);
    Task DeleteSubjectAsync(Subject subject);
    Task<bool> ExistsByNameAndCareerAsync(string name, Guid technicalCareerId);
    Task<bool> TechnicalCareerExistsAsync(Guid technicalCareerId);
    Task<bool> ExistsByIdAsync(Guid id);

    // Métodos para profesores
    Task AssignProfessorToSubjectAsync(Guid subjectId, string professorId);
    Task RemoveProfessorFromSubjectAsync(Guid subjectId);
}