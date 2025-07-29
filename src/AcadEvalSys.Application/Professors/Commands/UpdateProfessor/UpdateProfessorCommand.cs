using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.Professors.Commands.UpdateProfessor;

public class UpdateProfessorCommand : IRequest<bool>
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
}
