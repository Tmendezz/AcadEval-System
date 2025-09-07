using MediatR;

namespace AcadEvalSys.Application.Users.Commands.DeleteAdmin;

public class DeleteAdminUserCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}


