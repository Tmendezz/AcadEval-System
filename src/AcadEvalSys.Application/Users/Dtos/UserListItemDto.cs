namespace AcadEvalSys.Application.Users.Dtos;

public class UserListItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public IEnumerable<string> Roles { get; set; } = [];
    public bool IsLockedOut { get; set; }
}


