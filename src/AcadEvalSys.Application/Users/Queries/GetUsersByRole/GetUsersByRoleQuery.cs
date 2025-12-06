using AcadEvalSys.Application.Common;
using AcadEvalSys.Application.Users.Dtos;

namespace AcadEvalSys.Application.Users.Queries.GetUsersByRole;

public class GetUsersByRoleQuery : PagedQuery<UserListItemDto>
{
    public string? Role { get; set; }
}


