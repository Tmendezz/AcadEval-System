using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Queries.GetAllStudents;

public class GetAllStudentsQueryHandler(
    ILogger<GetAllStudentsQueryHandler> logger,
    IStudentRepository studentRepository,
    IMapper mapper
    ) : IRequestHandler<GetAllStudentsQuery, PagedResult<StudentDto>>
{
    public async Task<PagedResult<StudentDto>> Handle(GetAllStudentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all students with page {PageNumber}, size {PageSize}", request.PageNumber, request.PageSize);

        var (students, totalCount) = await studentRepository.GetAllAsync(
            request.PageNumber, 
            request.PageSize, 
            request.SearchTerm,
            request.TechnicalCareerId,
            request.CurrentYear);

        var studentDtos = mapper.Map<IEnumerable<StudentDto>>(students);

        return new PagedResult<StudentDto>(studentDtos, totalCount, request.PageNumber, request.PageSize);
    }
}
