using AcadEvalSys.Application.Evaluations.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstances;

public class GetAllEvaluationInstancesQueryHandler(
    ILogger<GetAllEvaluationInstancesQueryHandler> logger,
    IMapper mapper,
    ICompetencyEvaluationInstanceRepository repository) : IRequestHandler<GetAllEvaluationInstancesQuery, IEnumerable<EvaluationInstanceDto>>
{
    public async Task<IEnumerable<EvaluationInstanceDto>> Handle(GetAllEvaluationInstancesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all evaluation instances");
        var entities = await repository.GetAllAsync();
        return mapper.Map<IEnumerable<EvaluationInstanceDto>>(entities);
    }
}