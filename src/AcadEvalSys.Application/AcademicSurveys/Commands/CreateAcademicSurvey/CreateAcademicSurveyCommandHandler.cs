using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommandHandler(
        IAcademicSurveyRepository surveyRepository,
        ISubjectRepository subjectRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateAcademicSurveyCommandHandler> logger)

    : IRequestHandler<CreateAcademicSurveyCommand, Guid>
    {
        public async Task<Guid> Handle(CreateAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Iniciando creación de encuesta académica: {Title} con template {TemplateId}", 
                request.Title, request.TemplateId);

            // Crear la encuesta desde el template
            var surveyId = await surveyRepository.CreateFromTemplateAsync(
                request.Title, 
                request.TemplateId, 
                request.PublishAt, 
                request.CloseAt, 
                null, 
                cancellationToken);

            logger.LogInformation("Encuesta creada con ID: {SurveyId}", surveyId);

            // Configurar la audiencia
            await ConfigureSurveyAudienceAsync(surveyId, request.Audience, cancellationToken);

            logger.LogInformation("Intentando guardar cambios para encuesta {SurveyId}", surveyId);
            var changesSaved = await unitOfWork.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Cambios guardados: {ChangesSaved} entidades afectadas", changesSaved);

            logger.LogInformation("Encuesta académica creada exitosamente: {SurveyId}", surveyId);
            return surveyId;
        }

        private async Task ConfigureSurveyAudienceAsync(
            Guid surveyId, 
            List<SurveyAudienceDto> audience, 
            CancellationToken cancellationToken)
        {
            logger.LogInformation("Configurando audiencia para encuesta {SurveyId}: {AudienceCount} configuraciones de audiencia", 
                surveyId, audience.Count);

            var totalSubjectsAdded = 0;

            // Procesar cada configuración de audiencia (tecnicatura + años)
            foreach (var audienceConfig in audience)
            {
                logger.LogInformation("Procesando audiencia: Tecnicatura {CareerId} con años {Years}", 
                    audienceConfig.TechnicalCareerId, 
                    string.Join(", ", audienceConfig.SelectedYears));

                // Obtener asignaturas de esta tecnicatura y estos años específicos
                var subjects = await subjectRepository.GetByCareerAndYearsAsync(
                    new[] { audienceConfig.TechnicalCareerId }, 
                    audienceConfig.SelectedYears, 
                    cancellationToken);

                logger.LogInformation("Encontradas {SubjectCount} asignaturas para tecnicatura {CareerId} y años {Years}", 
                    subjects.Count(), audienceConfig.TechnicalCareerId, string.Join(", ", audienceConfig.SelectedYears));

                // Crear AcademicSurveySubject para cada asignatura
                foreach (var subject in subjects)
                {
                    var surveySubject = new AcademicSurveySubject
                    {
                        AcademicSurveyId = surveyId, // Usar el ID directamente
                        SubjectId = subject.Id,
                    };

                    // Agregar directamente al contexto en lugar de a la colección
                    await surveyRepository.AddSurveySubjectAsync(surveySubject, cancellationToken);
                    totalSubjectsAdded++;

                    logger.LogInformation("SurveySubject creado: Survey {SurveyId} -> Subject {SubjectId} ({SubjectName}, Año {Year})", 
                        surveyId, subject.Id, subject.Name, subject.Year);
                }
            }
            
            logger.LogInformation("Audiencia configurada: {TotalSubjects} asignaturas agregadas a la encuesta {SurveyId}", 
                totalSubjectsAdded, surveyId);
        }
    }
}
