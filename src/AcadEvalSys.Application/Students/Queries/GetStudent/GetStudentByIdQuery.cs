using AcadEvalSys.Application.Students.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Students.Queries.GetStudent;

public class GetStudentByIdQuery(string id) : IRequest<StudentDto>
{
    public string Id { get; set; } = id;
}