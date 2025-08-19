using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Commands.CreateAdmin;

public class CreateAdminUserCommandHandler(
    ILogger<CreateAdminUserCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<CreateAdminUserCommand, string>
{
    public async Task<string> Handle(CreateAdminUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating Admin user {Email}", request.Email);

        var existing = await userManager.FindByEmailAsync(request.Email);
        if (existing != null)
        {
            throw new DuplicateResourceException(nameof(User), request.Email);
        }

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.Name,
            PhoneNumber = request.Phone
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            throw new UserCreationException(string.Join(", ", createResult.Errors.Select(e => e.Description)));
        }

        var roleResult = await userManager.AddToRoleAsync(user, UserRoles.Admin);
        if (!roleResult.Succeeded)
        {
            throw new UserRoleAssignmentException(string.Join(", ", roleResult.Errors.Select(e => e.Description)));
        }

        logger.LogInformation("Admin user created with ID {Id}", user.Id);
        return user.Id;
    }
}


