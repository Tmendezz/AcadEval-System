using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Professors.Dtos;

namespace AcadEvalSys.Application.Professors.Queries.GetAllProfessors;

public class GetAllProfessorsQuery : PagedQuery<ProfessorDto>
{
    public Guid? TechnicalCareerId { get; set; }
}
