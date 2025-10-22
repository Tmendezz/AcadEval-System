using MediatR;

namespace AcadEvalSys.Application.Users.Commands.UpdateAdmin;

public class UpdateAdminUserCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Password { get; set; }
}


