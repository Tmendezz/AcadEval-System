using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Professors.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Queries.GetAllProfessors;

public class GetAllProfessorsQueryHandler(
    ILogger<GetAllProfessorsQueryHandler> logger,
    IProfessorRepository professorRepository,
    IMapper mapper
    ) : IRequestHandler<GetAllProfessorsQuery, PagedResult<ProfessorDto>>
{
    public async Task<PagedResult<ProfessorDto>> Handle(GetAllProfessorsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all professors with page {PageNumber}, size {PageSize}", request.PageNumber, request.PageSize);

        var (professors, totalCount) = await professorRepository.GetAllAsync(
            request.PageNumber, 
            request.PageSize, 
            request.SearchTerm,
            request.TechnicalCareerId);

        var professorDtos = mapper.Map<IEnumerable<ProfessorDto>>(professors);

        return new PagedResult<ProfessorDto>(professorDtos, totalCount, request.PageNumber, request.PageSize);
    }
}
