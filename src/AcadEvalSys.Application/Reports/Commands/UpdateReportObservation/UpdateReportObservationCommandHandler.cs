using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Commands.UpdateReportObservation;

public class UpdateReportObservationCommandHandler(IStudentEvaluationReportRepository reportRepository)
    : IRequestHandler<UpdateReportObservationCommand>
{
    public async Task Handle(UpdateReportObservationCommand request, CancellationToken cancellationToken)
    {
        var report = await reportRepository.GetByIdAsync(request.ReportId);
        
        if (report == null)
        {
            throw new NotFoundException(nameof(StudentEvaluationReport), request.ReportId.ToString());
        }

        // TODO: Verificar permisos (solo coordinadores/admins)
        // Implementar lógica de autorización aquí

        report.Observation = request.Observation;
        await reportRepository.UpdateAsync(report);
    }
}
