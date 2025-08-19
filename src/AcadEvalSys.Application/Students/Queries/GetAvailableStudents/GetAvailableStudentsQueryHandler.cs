using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;

namespace AcadEvalSys.Application.Students.Queries.GetAvailableStudents;

public class GetAvailableStudentsQueryHandler(
    IStudentRepository studentRepository,
    IMapper mapper) : IRequestHandler<GetAvailableStudentsQuery, IEnumerable<StudentDto>>
{
    public async Task<IEnumerable<StudentDto>> Handle(GetAvailableStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await studentRepository.GetAvailableStudentsForSubjectAsync(
            request.TechnicalCareerId, 
            request.SubjectId, 
            request.Year);

        return mapper.Map<IEnumerable<StudentDto>>(students);
    }
}
