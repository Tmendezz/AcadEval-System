using MediatR;

namespace AcadEvalSys.Application.Users.Commands.ResetPassword;

public class ResetUserPasswordCommand : IRequest<string>
{
    public string UserId { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
