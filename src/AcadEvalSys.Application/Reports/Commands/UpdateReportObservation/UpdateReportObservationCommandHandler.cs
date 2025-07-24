using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;

namespace AcadEvalSys.Application.Reports.Commands.UpdateReportObservation;

public class UpdateReportObservationCommandHandler(
    IStudentEvaluationReportRepository reportRepository,
    IUserContext userContext
) : IRequestHandler<UpdateReportObservationCommand>
{
    public async Task Handle(UpdateReportObservationCommand request, CancellationToken cancellationToken)
    {
        var report = await reportRepository.GetByIdAsync(request.ReportId);
        if (report == null)
            throw new NotFoundException(nameof(StudentEvaluationReport), request.ReportId.ToString());

        var user = userContext.GetCurrentUser();
        if (user == null || !(user.Roles.Contains(UserRoles.Admin) || user.Roles.Contains(UserRoles.Coordinator)))
            throw new ForbidException();

        report.Observation = request.Observation;
        await reportRepository.UpdateAsync(report);
    }
}
