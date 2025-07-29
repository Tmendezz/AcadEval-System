using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;

public class CreateTechnicalCareerCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
}