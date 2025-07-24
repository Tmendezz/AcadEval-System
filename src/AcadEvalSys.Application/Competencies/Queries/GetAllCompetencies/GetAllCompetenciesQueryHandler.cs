using AcadEvalSys.Application.Competencies.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Competencies.Queries.GetAllCompetencies;

public class GetAllCompetenciesQueryHandler(ILogger<GetAllCompetenciesQuery> logger, ICompetencyRepository competencyRepository, IMapper mapper) : IRequestHandler<GetAllCompetenciesQuery, IEnumerable<CompetencyDto>>
{
    public async Task<IEnumerable<CompetencyDto>> Handle(GetAllCompetenciesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all competencies");

        var competencies = await competencyRepository.GetAllAsync();

        var competenciesDto = mapper.Map<IEnumerable<CompetencyDto>>(competencies);

        logger.LogInformation("Successfully retrieved {Count} competencies", competenciesDto.Count());

        return competenciesDto;
    }
}