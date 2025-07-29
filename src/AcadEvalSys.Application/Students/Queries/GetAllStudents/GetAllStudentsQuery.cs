using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Students.Queries.GetAllStudents;

public class GetAllStudentsQuery : PagedQuery<StudentDto>
{
    public Guid? TechnicalCareerId { get; set; }
    public CareerYear? CurrentYear { get; set; }
}
