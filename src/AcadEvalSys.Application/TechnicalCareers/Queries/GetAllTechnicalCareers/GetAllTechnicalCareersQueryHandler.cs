using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetAllTechnicalCareers;

public class GetAllTechnicalCareersQueryHandler(
    ILogger<GetAllTechnicalCareersQueryHandler> logger,
    ITechnicalCareerRepository careerRepository,
    IStudentRepository studentRepository,
    ISubjectRepository subjectRepository,
    IMapper mapper) : IRequestHandler<GetAllTechnicalCareersQuery, IEnumerable<TechnicalCareerDto>>
{
    public async Task<IEnumerable<TechnicalCareerDto>> Handle(GetAllTechnicalCareersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all technical careers with statistics");

        var careers = await careerRepository.GetAllCareersAsync();
        var careerDtos = new List<TechnicalCareerDto>();

        foreach (var career in careers)
        {
            // Obtener estudiantes de esta carrera - usar totalCount del repositorio
            var (_, totalStudents) = await studentRepository.GetAllAsync(1, 1, null, career.Id, null);

            // Obtener profesores de esta carrera (a través de asignaturas)
            var allSubjects = await subjectRepository.GetAllSubjectsAsync();
            var careerSubjects = allSubjects.Where(s => s.TechnicalCareerId == career.Id).ToList();

            var professorIds = careerSubjects
                .Where(s => s.ProfessorId != null)
                .Select(s => s.ProfessorId)
                .Distinct()
                .ToList();

            var totalProfessors = professorIds.Count;

            var careerDto = mapper.Map<TechnicalCareerDto>(career);
            careerDto.TotalStudents = totalStudents;
            careerDto.TotalProfessors = totalProfessors;

            careerDtos.Add(careerDto);
        }

        logger.LogInformation("Successfully retrieved {Count} technical careers with statistics", careerDtos.Count);
        return careerDtos;
    }
}