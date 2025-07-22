using AcadEvalSys.Application.Subjects.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;

public class GetAllSubjectsQuery : IRequest<IEnumerable<SubjectDto>>
{
    
}