using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Repositories;

public interface ISubjectRepository
{
    Task<Guid> CreateSubjectAsync(Subject subject);
    Task<Subject?> GetSubjectByIdAsync(Guid id);
    Task<IEnumerable<Subject>> GetAllSubjectsAsync();
    Task UpdateSubjectAsync(Subject subject);
    Task<bool> ExistsByNameAndCareerAsync(string name, Guid technicalCareerId);
    Task<bool> ExistsByIdAsync(Guid id);
    
    // Métodos para profesores
    Task AssignProfessorToSubjectAsync(Guid subjectId, string professorId);
    Task RemoveProfessorFromSubjectAsync(Guid subjectId);
    Task<IEnumerable<Subject>> GetByProfessorIdAsync(string professorId);
    
    // Método para soft delete
    Task DeleteAsync(Subject subject);

    // Verificaciones
    Task<bool> UserTeachesInCareerAsync(string userId, Guid technicalCareerId);
    
    // Método optimizado para obtener asignaturas por tecnicaturas y años
    Task<IEnumerable<Subject>> GetByCareerAndYearsAsync(
        IEnumerable<Guid> careerIds, 
        IEnumerable<CareerYear> years, 
        CancellationToken cancellationToken = default);
}