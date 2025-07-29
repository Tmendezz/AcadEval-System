using MediatR;

namespace AcadEvalSys.Application.Reports.Commands.UpdateReportObservation;

public class UpdateReportObservationCommand : IRequest
{
    public Guid ReportId { get; set; }
    public string? Observation { get; set; }
}
