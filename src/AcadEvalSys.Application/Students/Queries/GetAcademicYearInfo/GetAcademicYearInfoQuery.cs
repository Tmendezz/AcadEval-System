using MediatR;
using AcadEvalSys.Application.Students.Dtos;

namespace AcadEvalSys.Application.Students.Queries.GetAcademicYearInfo;

/// <summary>
/// Query para obtener información sobre el año académico actual y el estado de las inscripciones
/// </summary>
public record GetAcademicYearInfoQuery : IRequest<AcademicYearInfoDto>;
