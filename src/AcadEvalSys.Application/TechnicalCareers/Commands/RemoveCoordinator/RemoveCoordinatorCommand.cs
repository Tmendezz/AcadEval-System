using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.RemoveCoordinator;

public class RemoveCoordinatorCommand : IRequest
{
    public Guid TechnicalCareerId { get; set; }
}



