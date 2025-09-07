using AcadEvalSys.Application.Professors.Queries.GetProfessorAssignments;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Queries.GetProfessorAssignments;

public class GetProfessorAssignmentsQueryHandler(
    ILogger<GetProfessorAssignmentsQueryHandler> logger,
    ISubjectRepository subjectRepository
) : IRequestHandler<GetProfessorAssignmentsQuery, ProfessorAssignmentsDto>
{
    public async Task<ProfessorAssignmentsDto> Handle(GetProfessorAssignmentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting assignments for professor {ProfessorId}", request.ProfessorId);

        var assignedSubjects = await subjectRepository.GetByProfessorIdAsync(request.ProfessorId);

        return new ProfessorAssignmentsDto
        {
            HasAssignments = assignedSubjects.Any(),
            AssignedSubjects = assignedSubjects.Select(s => new SubjectAssignmentDto
            {
                Id = s.Id,
                Name = s.Name ?? string.Empty,
                CareerName = s.TechnicalCareer?.Name ?? string.Empty,
                Year = (int)s.Year
            }).ToList()
        };
    }
}
