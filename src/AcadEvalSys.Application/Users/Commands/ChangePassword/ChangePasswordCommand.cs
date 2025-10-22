using MediatR;

namespace AcadEvalSys.Application.Users.Commands.ChangePassword;

public class ChangePasswordCommand(string userId, string newPassword) : IRequest<bool>
{
    public string UserId { get; } = userId;
    public string NewPassword { get; } = newPassword;
}
