using AcadEvalSys.Application.Subjects.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Queries.GetSubjectById;

public class GetSubjectByIdQuery : IRequest<SubjectDto>
{
    public Guid Id { get; set; }
}