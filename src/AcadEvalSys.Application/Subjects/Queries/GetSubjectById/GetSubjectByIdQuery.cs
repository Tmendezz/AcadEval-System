using AcadEvalSys.Application.Subjects.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Queries.GetSubjectById;

public class GetSubjectByIdQuery : IRequest<SubjectDto>
{
    public Guid Id { get; set; }
    public Guid TechnicalCareerId { get; set; }
    public bool IncludeEnrolledStudents { get; set; } = false;
}