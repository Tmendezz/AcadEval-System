using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Commands.UpdateAdmin;

public class UpdateAdminUserCommandHandler(
    ILogger<UpdateAdminUserCommandHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<UpdateAdminUserCommand>
{
    public async Task Handle(UpdateAdminUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating Admin user {Id}", request.Id);

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

        // Verificar si el email ya existe en otro usuario
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null && existingUser.Id != request.Id)
        {
            throw new DuplicateResourceException(nameof(User), request.Email);
        }

        // Actualizar datos básicos
        user.UserName = request.Email;
        user.Email = request.Email;
        user.Name = request.Name;
        user.PhoneNumber = request.Phone;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new UserCreationException(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
        }

        // Actualizar contraseña si se proporciona
        if (!string.IsNullOrEmpty(request.Password))
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var passwordResult = await userManager.ResetPasswordAsync(user, token, request.Password);
            if (!passwordResult.Succeeded)
            {
                throw new UserCreationException(string.Join(", ", passwordResult.Errors.Select(e => e.Description)));
            }
        }

        logger.LogInformation("Admin user {Id} updated successfully", request.Id);
    }
}
