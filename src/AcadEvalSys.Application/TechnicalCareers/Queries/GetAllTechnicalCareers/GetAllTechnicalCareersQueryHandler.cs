using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetAllTechnicalCareers;

public class GetAllTechnicalCareersQueryHandler(ILogger<GetAllTechnicalCareersQueryHandler> logger, ITechnicalCareerRepository careerRepository, IMapper mapper) : IRequestHandler<GetAllTechnicalCareersQuery, IEnumerable<TechnicalCareerDto>>
{
    public async Task<IEnumerable<TechnicalCareerDto>> Handle(GetAllTechnicalCareersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all technical careers");
        var careers = await careerRepository.GetAllCareersAsync();
        var careerDtos = mapper.Map<IEnumerable<TechnicalCareerDto>>(careers);
        logger.LogInformation("Successfully retrieved {Count} technical careers", careerDtos.Count());
        return careerDtos;
    }
}