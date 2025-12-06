using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Commands.DeleteAdmin;

public class DeleteAdminUserCommandHandler(
    ILogger<DeleteAdminUserCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<DeleteAdminUserCommand>
{
    public async Task Handle(DeleteAdminUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting Admin user {Id}", request.Id);

        var user = await userManager.FindByIdAsync(request.Id);
        if (user == null)
        {
            throw new NotFoundException(nameof(User), request.Id);
        }

        // Verificar si el usuario es administrador
        var isAdmin = await userManager.IsInRoleAsync(user, UserRoles.Admin);
        if (!isAdmin)
        {
            throw new ForbidException("User is not an administrator");
        }

        // Soft delete: marcar como inactivo
        user.IsActive = false;
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new UserCreationException(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
        }

        logger.LogInformation("Admin user {Id} deleted successfully", request.Id);
    }
}
