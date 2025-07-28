using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;

public class GetAllSubjectsQuery : IRequest<IEnumerable<SubjectDto>>
{
    public Guid TechnicalCareerId { get; set; }
    public bool IncludeEnrolledStudents { get; set; } = false;
    public CareerYear? Year { get; set; }
}