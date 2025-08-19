using MediatR;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.AddStudentToCareer;

public class AddStudentToCareerCommand : IRequest<string>
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Guid TechnicalCareerId { get; set; }
    public CareerYear CurrentYear { get; set; }
}
