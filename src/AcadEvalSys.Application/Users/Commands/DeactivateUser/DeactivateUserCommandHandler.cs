using AcadEvalSys.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Commands.DeactivateUser;

public class DeactivateUserCommandHandler(
    ILogger<DeactivateUserCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<DeactivateUserCommand>
{
    public async Task Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deactivating user {Email}", request.UserEmail);
        var user = await userManager.FindByEmailAsync(request.UserEmail);
        if (user == null)
        {
            logger.LogWarning("User {Email} not found", request.UserEmail);
            return;
        }

        user.LockoutEnabled = true;
        // Lock the account far in the future
        user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
        await userManager.UpdateAsync(user);
        logger.LogInformation("User {Email} deactivated (lockout applied)", request.UserEmail);
    }
}


