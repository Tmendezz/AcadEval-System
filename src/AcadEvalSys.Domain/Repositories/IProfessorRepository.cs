using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Repositories;

public interface IProfessorRepository
{
    Task<Professor?> GetByIdAsync(string professorId);
    Task<(IEnumerable<Professor> Professors, int TotalCount)> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null, Guid? technicalCareerId = null);
    Task CreateAsync(Professor professor);
    Task UpdateAsync(Professor professor);
    Task DeleteAsync(string professorId);
}
