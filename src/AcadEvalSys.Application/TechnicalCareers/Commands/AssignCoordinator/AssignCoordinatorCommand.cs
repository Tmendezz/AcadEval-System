using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.AssignCoordinator;

public class AssignCoordinatorCommand : IRequest
{
    public Guid TechnicalCareerId { get; set; }
    public string UserId { get; set; } = string.Empty;
}


