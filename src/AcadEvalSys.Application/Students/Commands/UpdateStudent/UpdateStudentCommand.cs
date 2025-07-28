using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.Students.Commands.UpdateStudent;

public class UpdateStudentCommand : IRequest<bool>
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? TechnicalCareerId { get; set; }
    public CareerYear? CurrentYear { get; set; }
}
