using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Reports.Commands.DeleteReport;

public class DeleteReportCommandHandler(
    IStudentEvaluationReportRepository reportRepository,
    IStorageService storageService)
    : IRequestHandler<DeleteReportCommand>
{
    public async Task Handle(DeleteReportCommand request, CancellationToken cancellationToken)
    {
        var report = await reportRepository.GetByIdAsync(request.ReportId);
        
        if (report == null)
        {
            throw new NotFoundException(nameof(StudentEvaluationReport), request.ReportId.ToString());
        }

        // TODO: Verificar permisos (solo admins)
        // Implementar lógica de autorización aquí

        // Eliminar archivo de Azure Storage si existe
        if (!string.IsNullOrEmpty(report.BlobName))
        {
            await storageService.DeleteFileAsync(report.BlobName, report.ContainerName);
        }

        // Eliminar registro de la base de datos
        await reportRepository.DeleteAsync(request.ReportId);
    }
}
