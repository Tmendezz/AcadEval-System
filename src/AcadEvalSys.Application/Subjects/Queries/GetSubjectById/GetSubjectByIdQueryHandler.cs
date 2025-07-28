using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Queries.GetSubjectById;

public class GetSubjectByIdQueryHandler(
    ILogger<GetSubjectByIdQueryHandler> logger,
    IMapper mapper,
    ISubjectRepository subjectRepository) : IRequestHandler<GetSubjectByIdQuery, SubjectDto>
{
    public async Task<SubjectDto> Handle(GetSubjectByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting subject with ID: {Id} for career {CareerId} with enrolled students: {IncludeStudents}",
            request.Id, request.TechnicalCareerId, request.IncludeEnrolledStudents);

        var subject = await subjectRepository.GetSubjectByIdAsync(request.Id);

        if (subject == null)
        {
            logger.LogWarning("Subject with ID: {Id} not found", request.Id);
            throw new NotFoundException(nameof(Subject), request.Id.ToString());
        }

        if (subject.TechnicalCareerId != request.TechnicalCareerId)
        {
            logger.LogWarning("Subject with ID: {Id} does not belong to career {CareerId}", request.Id, request.TechnicalCareerId);
            throw new NotFoundException(nameof(Subject), request.Id.ToString());
        }

        if (!request.IncludeEnrolledStudents)
        {
            subject.StudentSubjects = null;
        }

        var result = mapper.Map<SubjectDto>(subject);

        logger.LogInformation("Subject with ID: {Id} retrieved successfully for career {CareerId}", request.Id, request.TechnicalCareerId);

        return result;
    }
}