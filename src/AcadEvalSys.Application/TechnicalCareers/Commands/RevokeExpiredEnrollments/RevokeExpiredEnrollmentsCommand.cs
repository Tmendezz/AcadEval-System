using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.RevokeExpiredEnrollments;

public class RevokeExpiredEnrollmentsCommand : IRequest<RevokeExpiredEnrollmentsResult>
{
    public int? SpecificYear { get; set; } // Si es null, revoca el año anterior
}
