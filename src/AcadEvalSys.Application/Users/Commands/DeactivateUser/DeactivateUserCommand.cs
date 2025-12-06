using MediatR;

namespace AcadEvalSys.Application.Users.Commands.DeactivateUser;

public class DeactivateUserCommand : IRequest
{
    public string UserEmail { get; set; } = null!;
}


