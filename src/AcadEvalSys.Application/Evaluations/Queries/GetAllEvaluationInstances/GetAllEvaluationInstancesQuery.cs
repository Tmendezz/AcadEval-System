using AcadEvalSys.Application.Evaluations.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstances;

public record GetAllEvaluationInstancesQuery : IRequest<IEnumerable<EvaluationInstanceDto>>;