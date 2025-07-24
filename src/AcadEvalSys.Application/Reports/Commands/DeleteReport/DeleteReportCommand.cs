using MediatR;

namespace AcadEvalSys.Application.Reports.Commands.DeleteReport;

public class DeleteReportCommand : IRequest
{
    public Guid ReportId { get; set; }
}
