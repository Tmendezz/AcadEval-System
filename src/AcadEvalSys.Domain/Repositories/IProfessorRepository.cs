using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IProfessorRepository
{
    Task<Professor?> GetByIdAsync(string professorId);
    Task<bool> ExistsAsync(string professorId);
    Task<IEnumerable<Professor>> GetAllAsync();
    Task<IEnumerable<Subject>> GetSubjectsByProfessorAsync(string professorId);
}
