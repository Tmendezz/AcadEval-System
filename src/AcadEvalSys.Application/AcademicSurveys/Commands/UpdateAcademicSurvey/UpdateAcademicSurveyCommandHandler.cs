using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;

public class UpdateAcademicSurveyCommandHandler(IAcademicSurveyRepository repository) : IRequestHandler<UpdateAcademicSurveyCommand>
{
    public async Task Handle(UpdateAcademicSurveyCommand request, CancellationToken cancellationToken)
    {
        var existing = await repository.GetByIdAsync(request.Id, includeChildren: false, cancellationToken)
            ?? throw new KeyNotFoundException("Encuesta no encontrada o inactiva");

        existing.Title = request.Title.Trim();
        existing.PublishAt = request.PublishAt;
        existing.CloseAt = request.CloseAt;

        // Ajuste de estado según fechas
        var now = DateTime.UtcNow;
        if (existing.CloseAt.HasValue && existing.CloseAt.Value <= now)
        {
            existing.Status = SurveyStatus.Closed;
        }
        else if (existing.PublishAt.HasValue && existing.PublishAt.Value <= now)
        {
            existing.Status = SurveyStatus.Published;
        }
        else if (existing.PublishAt.HasValue || existing.CloseAt.HasValue)
        {
            existing.Status = SurveyStatus.Scheduled;
        }
        else
        {
            existing.Status = SurveyStatus.Draft;
        }

        await repository.UpdateAsync(existing, cancellationToken);

        // Audiencia: para mantenerlo simple ahora, delegamos en un endpoint existente (SetSubjects) en otro flujo.
        // Si más adelante definimos la relación directa con carreras/años, se actualizará aquí.
    }
}



