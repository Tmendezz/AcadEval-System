using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Domain.Exceptions;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetAssignedSurveys;

public class GetAssignedSurveysQueryHandler(
    ILogger<GetAssignedSurveysQueryHandler> logger,
    IUserContext userContext,
    IAcademicSurveyResponseRepository repository,
    IMapper mapper
    ) : IRequestHandler<GetAssignedSurveysQuery, IEnumerable<UserSurveyDto>>
{
    public async Task<IEnumerable<UserSurveyDto>> Handle(GetAssignedSurveysQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Obteniendo encuestas asignadas para el usuario con estado: {Status}", request.Status);

        var user = userContext.GetCurrentUser();
        
        if (user == null || string.IsNullOrEmpty(user.Id))
        {
            logger.LogWarning("No se pudo obtener el usuario actual");
            throw new UnauthorizedException();
        }

        var role = user.Roles.First();
        
        IEnumerable<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt)> surveys;

        if (role == UserRoles.Professor)
        {
            logger.LogInformation("Obteniendo encuestas asignadas para el profesor: {UserId}", user.Id);
            surveys = await repository.GetAssignedSurveysForProfessorAsync(user.Id, request.Status, cancellationToken);
        }
        else if (role == UserRoles.Student)
        {
            logger.LogInformation("Obteniendo encuestas asignadas para el estudiante: {UserId}", user.Id);
            surveys = await repository.GetAssignedSurveysForStudentAsync(user.Id, request.Status, cancellationToken);
        }
        else
        {
            logger.LogWarning("Rol de usuario no válido para obtener encuestas asignadas: {Role}", role);
            throw new ForbidException();
        }

        var result = mapper.Map<IEnumerable<UserSurveyDto>>(surveys).ToList();

        logger.LogInformation("Se encontraron {Count} encuestas asignadas para el usuario", result.Count);
        
        return result;
    }
}