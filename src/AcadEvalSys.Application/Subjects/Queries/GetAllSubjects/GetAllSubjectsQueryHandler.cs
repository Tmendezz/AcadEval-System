using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Queries.GetAllSubjects;

public class GetAllSubjectsQueryHandler(
    ILogger<GetAllSubjectsQueryHandler> logger,
    IMapper mapper,
    ISubjectRepository subjectRepository) : IRequestHandler<GetAllSubjectsQuery, IEnumerable<SubjectDto>>
{
    public async Task<IEnumerable<SubjectDto>> Handle(GetAllSubjectsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all subjects for career {CareerId} with enrolled students: {IncludeStudents}",
            request.TechnicalCareerId, request.IncludeEnrolledStudents);

        var subjects = await subjectRepository.GetAllSubjectsAsync();

        var filteredSubjects = subjects.Where(s => s.TechnicalCareerId == request.TechnicalCareerId);

        if (request.Year != null)
        {
            filteredSubjects = filteredSubjects.Where(s => s.Year == request.Year);
        }

        var result = mapper.Map<IEnumerable<SubjectDto>>(filteredSubjects);

        if (!request.IncludeEnrolledStudents)
        {
            result = result.Select(s => s with { EnrolledStudents = null });
        }

        logger.LogInformation("Retrieved {Count} subjects for career {CareerId}", result.Count(), request.TechnicalCareerId);

        return result;
    }
}