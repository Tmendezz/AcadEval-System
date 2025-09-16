using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsForUser;

public class GetSurveySubjectsForUserQueryHandler : IRequestHandler<GetSurveySubjectsForUserQuery, IEnumerable<SurveySubjectForUserDto>>
{
    private readonly IAcademicSurveyRepository academicSurveyRepository;
    private readonly IUserContext userContext;
    private readonly ILogger<GetSurveySubjectsForUserQueryHandler> logger;

    public GetSurveySubjectsForUserQueryHandler(
        IAcademicSurveyRepository academicSurveyRepository,
        IUserContext userContext,
        ILogger<GetSurveySubjectsForUserQueryHandler> logger)
    {
        this.academicSurveyRepository = academicSurveyRepository;
        this.userContext = userContext;
        this.logger = logger;
    }

    public async Task<IEnumerable<SurveySubjectForUserDto>> Handle(GetSurveySubjectsForUserQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser?.Id == null)
        {
            throw new UnauthorizedAccessException("Usuario no autenticado");
        }

        logger.LogInformation("Obteniendo survey subjects de la encuesta {SurveyId} para el usuario {UserId}", 
            request.SurveyId, currentUser.Id);

        var surveySubjects = await academicSurveyRepository.GetSurveySubjectsForUserAsync(request.SurveyId, currentUser.Id);
        
        logger.LogInformation("Se encontraron {Count} survey subjects para la encuesta {SurveyId} y usuario {UserId}", 
            surveySubjects.Count(), request.SurveyId, currentUser.Id);

        // Mapeo manual porque AutoMapper no puede mapear tuplas directamente
        var result = surveySubjects.Select(item => new SurveySubjectForUserDto
        {
            SurveySubjectId = item.SurveySubject.Id,
            SubjectName = item.SurveySubject.Subject?.Name ?? "Sin nombre",
            ProfessorName = item.SurveySubject.Subject?.Professor?.User?.Name ?? "Sin profesor",
            HasResponded = item.HasResponded,
            RespondedAt = item.RespondedAt,
            QuestionsCount = item.SurveySubject.AcademicSurvey?.Questions?.Count ?? 0
        }).ToList();    

        return result;
    }
}
