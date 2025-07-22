using AcadEvalSys.Application.Students.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Queries.GetStudent;

public class GetStudentByIdQueryHandler(ILogger<GetStudentByIdQueryHandler> logger, IMapper mapper, IStudentRepository studentRepository) : IRequestHandler<GetStudentByIdQuery, StudentDto>      
{
    public async Task<StudentDto> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting student by ID: {StudentId}", request.Id);
        var student = await studentRepository.GetByIdAsync(request.Id);
        if (student == null)
        {
            logger.LogWarning("Student with ID {StudentId} not found", request.Id);
            throw new NotFoundException(nameof(Student), request.Id);
        }
        var studentDto = mapper.Map<StudentDto>(student);
        logger.LogInformation("Student found: {@StudentDto}", studentDto);
        return studentDto;
    }
}