using MediatR;

namespace AcadEvalSys.Application.Users.Commands.GenerateTemporaryPassword;

public class GenerateTemporaryPasswordCommand : IRequest<GenerateTemporaryPasswordResult>
{
    public string UserId { get; set; } = string.Empty;
}

public class GenerateTemporaryPasswordResult
{
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string TemporaryPassword { get; set; } = string.Empty;
}
