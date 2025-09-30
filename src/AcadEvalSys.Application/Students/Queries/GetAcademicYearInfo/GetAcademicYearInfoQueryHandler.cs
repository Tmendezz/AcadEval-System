using AcadEvalSys.Application.Services;
using AcadEvalSys.Application.Students.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Students.Queries.GetAcademicYearInfo;

/// <summary>
/// Handler para obtener información sobre el año académico actual
/// </summary>
public class GetAcademicYearInfoQueryHandler : IRequestHandler<GetAcademicYearInfoQuery, AcademicYearInfoDto>
{
    private readonly IEnrollmentExpirationService _enrollmentExpirationService;

    public GetAcademicYearInfoQueryHandler(IEnrollmentExpirationService enrollmentExpirationService)
    {
        _enrollmentExpirationService = enrollmentExpirationService;
    }

    public Task<AcademicYearInfoDto> Handle(GetAcademicYearInfoQuery request, CancellationToken cancellationToken)
    {
        var currentYear = _enrollmentExpirationService.GetCurrentAcademicYear();
        var previousYear = currentYear - 1;
        
        var result = new AcademicYearInfoDto
        {
            CurrentAcademicYear = currentYear,
            PreviousAcademicYear = previousYear,
            CurrentDate = DateTime.UtcNow,
            NextAutomaticRevocation = new DateTime(currentYear, 1, 1, 2, 0, 0), // 1 de enero a las 2:00 AM
            Description = $"El sistema revocará automáticamente las inscripciones del año {previousYear} el 1 de enero de {currentYear} a las 2:00 AM"
        };

        return Task.FromResult(result);
    }
}
