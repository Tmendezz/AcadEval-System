using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Users.Dtos;
using AcadEvalSys.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Application.Users.Queries.GetUsersByRole;

public class GetUsersByRoleQueryHandler(
    ILogger<GetUsersByRoleQueryHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<GetUsersByRoleQuery, PagedResult<UserListItemDto>>
{
    public async Task<PagedResult<UserListItemDto>> Handle(GetUsersByRoleQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting users by role {Role} with page {PageNumber}, size {PageSize}", 
            request.Role ?? "All", request.PageNumber, request.PageSize);

        IQueryable<User> query;

        if (string.IsNullOrWhiteSpace(request.Role))
        {
            // Si no se especifica rol, obtener todos los usuarios activos
            query = userManager.Users.Where(u => u.IsActive);
        }
        else
        {
            // Obtener usuarios con rol específico que estén activos
            var usersInRole = await userManager.GetUsersInRoleAsync(request.Role);
            query = usersInRole.Where(u => u.IsActive).AsQueryable();
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm;
            query = query.Where(u =>
                (u.Email != null && u.Email.Contains(term)) ||
                (u.UserName != null && u.UserName.Contains(term)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(term)) ||
                ((u as User)!.Name != null && (u as User)!.Name!.Contains(term))
            );
        }

        var totalCount = query.Count();
        var page = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var size = request.PageSize <= 0 ? 10 : request.PageSize;

        var pageUsers = query
            .Skip((page - 1) * size)
            .Take(size)
            .ToList();

        var items = new List<UserListItemDto>(pageUsers.Count);
        foreach (var user in pageUsers)
        {
            var roles = await userManager.GetRolesAsync(user);
            items.Add(new UserListItemDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Name = (user as User)?.Name ?? user.UserName ?? string.Empty,
                Phone = user.PhoneNumber,
                Roles = roles.ToList(),
                IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow
            });
        }

        return new PagedResult<UserListItemDto>(items, totalCount, page, size);
    }
}
