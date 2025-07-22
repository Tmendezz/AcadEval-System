using AcadEvalSys.Application.Subjects.Dtos;
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
        logger.LogInformation("Retrieving all subjects");
        var subjects = await subjectRepository.GetAllSubjectsAsync();
        return mapper.Map<IEnumerable<SubjectDto>>(subjects);
    }
}