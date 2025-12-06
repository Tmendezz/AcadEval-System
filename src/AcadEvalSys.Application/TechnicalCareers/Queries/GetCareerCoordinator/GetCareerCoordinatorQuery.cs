using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetCareerCoordinator;

public class GetCareerCoordinatorQuery : IRequest<GetCareerCoordinatorDto?>
{
    public Guid TechnicalCareerId { get; set; }
}



