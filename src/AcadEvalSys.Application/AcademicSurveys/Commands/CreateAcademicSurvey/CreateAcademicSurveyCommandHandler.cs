using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
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

            // Usar transacción para asegurar consistencia
            await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);
            
            try
            {
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
                await ConfigureSurveyAudienceAsync(surveyId, request.SelectedCareerIds, request.SelectedYears, cancellationToken);

                await unitOfWork.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                logger.LogInformation("Encuesta académica creada exitosamente: {SurveyId}", surveyId);
                return surveyId;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al crear encuesta académica: {Title}", request.Title);
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }

        private async Task ConfigureSurveyAudienceAsync(
            Guid surveyId, 
            List<Guid> selectedCareerIds, 
            List<CareerYear> selectedYears, 
            CancellationToken cancellationToken)
        {
            logger.LogInformation("Configurando audiencia para encuesta {SurveyId}: {CareerCount} tecnicaturas, {YearCount} años", 
                surveyId, selectedCareerIds.Count, selectedYears.Count);

            var survey = await surveyRepository.GetByIdAsync(surveyId, true, cancellationToken);
            if (survey == null)
            {
                logger.LogError("Survey con ID {SurveyId} no encontrada", surveyId);
                throw new InvalidOperationException($"Survey with ID {surveyId} not found.");
            }

            // Obtener solo las asignaturas relevantes (mejor performance)
            var relevantSubjects = await subjectRepository.GetByCareerAndYearsAsync(
                selectedCareerIds, 
                selectedYears, 
                cancellationToken);

            logger.LogInformation("Encontradas {SubjectCount} asignaturas relevantes para la audiencia", relevantSubjects.Count());

            // Crear AcademicSurveySubject para cada asignatura relevante
            foreach (var subject in relevantSubjects)
            {
                var surveySubject = new AcademicSurveySubject
                {
                    AcademicSurveyId = survey.Id,
                    TechnicalCareerId = subject.TechnicalCareerId,
                    Year = subject.Year,
                    SubjectId = subject.Id,
                    ProfessorUserId = subject.ProfessorId
                };  

                survey.Subjects.Add(surveySubject);
            }

            // No necesitamos UpdateAsync aquí porque los cambios se persistirán con unitOfWork.SaveChangesAsync()
            logger.LogInformation("Audiencia configurada: {SubjectCount} asignaturas agregadas a la encuesta {SurveyId}", 
                survey.Subjects.Count, surveyId);
        }
    }
}
