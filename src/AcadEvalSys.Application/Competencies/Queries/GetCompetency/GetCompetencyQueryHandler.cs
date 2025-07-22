using AcadEvalSys.Application.Competencies.Dtos;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Competencies.Queries.GetCompetency;

public class GetCompetencyQueryHandler(ILogger<GetCompetencyQueryHandler> logger, ICompetencyRepository competencyRepository, IMapper mapper): IRequestHandler<GetCompetencyQuery, CompetencyDto>
{
    public async Task<CompetencyDto> Handle(GetCompetencyQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting competency with ID: {Id}", request.Id);
        
        var competency = await competencyRepository.GetByIdAsync(request.Id);
        
        if (competency == null)
        {
            logger.LogWarning("Competency with ID: {Id} not found", request.Id);
            throw new NotFoundException(nameof(competency), request.Id.ToString());
        }
        
        var competencyDto = mapper.Map<CompetencyDto>(competency);
        return competencyDto;
    }
}