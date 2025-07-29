using AcadEvalSys.Application.Professors.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Queries.GetProfessor;

public class GetProfessorByIdQueryHandler(
    ILogger<GetProfessorByIdQueryHandler> logger,
    IProfessorRepository professorRepository,
    IMapper mapper
    ) : IRequestHandler<GetProfessorByIdQuery, ProfessorDto>
{
    public async Task<ProfessorDto> Handle(GetProfessorByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting professor with ID: {Id}", request.Id);

        var professor = await professorRepository.GetByIdAsync(request.Id);
        if (professor == null)
        {
            logger.LogWarning("Professor with ID {Id} not found", request.Id);
            throw new NotFoundException(nameof(Professor), request.Id);
        }

        return mapper.Map<ProfessorDto>(professor);
    }
}
