using MediatR;
using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Students.Queries.GetAvailableStudents;

public class GetAvailableStudentsQuery : IRequest<IEnumerable<StudentDto>>
{
    public Guid TechnicalCareerId { get; set; }
    public Guid SubjectId { get; set; }
    public CareerYear? Year { get; set; }
}
