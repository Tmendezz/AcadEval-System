using AcadEvalSys.Application.Evaluations.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstanceById;

public class GetEvaluationInstanceByIdQueryHandler(
    ILogger<GetEvaluationInstanceByIdQueryHandler> logger,
    IMapper mapper,
    ICompetencyEvaluationInstanceRepository repository) : IRequestHandler<GetEvaluationInstanceByIdQuery, EvaluationInstanceDto>
{
    public async Task<EvaluationInstanceDto> Handle(GetEvaluationInstanceByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving evaluation instance {InstanceId}", request.Id);
        var entity = await repository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(CompetencyEvaluationInstance), request.Id.ToString());
        return mapper.Map<EvaluationInstanceDto>(entity);
    }
}