using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Users.Dtos;
using AcadEvalSys.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Users.Queries.GetAdmins;

public class GetAdminsQueryHandler(
    ILogger<GetAdminsQueryHandler> logger,
    UserManager<User> userManager
) : IRequestHandler<GetAdminsQuery, PagedResult<UserListItemDto>>
{
    public async Task<PagedResult<UserListItemDto>> Handle(GetAdminsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting admins with page {PageNumber}, size {PageSize}", request.PageNumber, request.PageSize);

        var admins = await userManager.GetUsersInRoleAsync("Admin");
        var query = admins.AsQueryable();

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
                Roles = roles
            });
        }

        return new PagedResult<UserListItemDto>(items, totalCount, page, size);
    }
}


