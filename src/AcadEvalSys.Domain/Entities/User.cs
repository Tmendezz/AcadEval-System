using Microsoft.AspNetCore.Identity;

namespace AcadEvalSys.Domain.Entities;

public class User : IdentityUser
{    
    public string? Name { get; set; }
    public bool IsActive { get; set; } = true;
    public virtual Student? Student { get; private set; }
    public virtual Professor? Professor { get; private set; }
    public virtual Coordinator? Coordinator { get; private set; }
    
}