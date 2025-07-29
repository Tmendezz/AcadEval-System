using AcadEvalSys.Application.Evaluations.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAllEvaluationInstanceById;

public record GetEvaluationInstanceByIdQuery(Guid Id) : IRequest<EvaluationInstanceDto>;