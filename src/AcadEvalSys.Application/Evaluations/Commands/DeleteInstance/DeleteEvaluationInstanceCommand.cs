using MediatR;

namespace AcadEvalSys.Application.Evaluations.Commands.DeleteInstance;

public record DeleteEvaluationInstanceCommand(Guid Id) : IRequest;