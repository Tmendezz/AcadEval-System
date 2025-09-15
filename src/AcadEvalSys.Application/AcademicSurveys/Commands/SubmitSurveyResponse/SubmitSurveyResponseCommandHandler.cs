using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Application.Users;
using MediatR;
using Microsoft.Extensions.Logging;
using AcadEvalSys.Domain.Constants.Constants; // Para UserRoles

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommandHandler(
        IAcademicSurveyRepository surveyRepository,
        IUserContext userContext,
        ILogger<SubmitSurveyResponseCommandHandler> logger
    ) : IRequestHandler<SubmitSurveyResponseCommand, Guid>
    {
        public async Task<Guid> Handle(SubmitSurveyResponseCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedAccessException("Usuario no autenticado.");

            request.UserId = currentUser.Id!;

            // IMPORTANTE: GetSubjectGraphAsync debe incluir .ThenInclude(sv => sv.Template) para que survey.Template no sea null.
            var subject = await surveyRepository.GetSubjectGraphAsync(request.AcademicSurveySubjectId, cancellationToken)
                ?? throw new KeyNotFoundException("SurveySubject no encontrado o inactivo.");

            var survey = subject.AcademicSurvey
                ?? throw new InvalidOperationException("Inconsistencia: el Subject no tiene AcademicSurvey.");

            // Estado y ventana temporal
            if (survey.Status != SurveyStatus.Published)
                throw new InvalidOperationException("La encuesta no está publicada.");

            var now = DateTime.UtcNow;
            if (survey.PublishAt.HasValue && now < survey.PublishAt.Value)
                throw new InvalidOperationException("La encuesta aún no está disponible.");
            if (survey.CloseAt.HasValue && now > survey.CloseAt.Value)
                throw new InvalidOperationException("La encuesta está cerrada.");

            // Validación de tipo (Student / Professor) según la plantilla
            var expectedType = survey.Template?.SurveyType;
            if (expectedType is not null)
            {
                switch (expectedType)
                {
                    case SurveyTemplateType.Student when !currentUser.IsInRole(UserRoles.Student):
                        throw new InvalidOperationException("Solo estudiantes pueden responder esta encuesta.");
                    case SurveyTemplateType.Professor when !currentUser.IsInRole(UserRoles.Professor):
                        throw new InvalidOperationException("Solo profesores pueden responder esta encuesta.");
                }
            }

            var questionLookup = survey.Questions.ToDictionary(q => q.Id);
            var requiredIds = survey.Questions.Where(q => q.IsRequired).Select(q => q.Id).ToHashSet();

            var answeredIds = request.Answers.Select(a => a.QuestionId).ToHashSet();
            var missingRequired = requiredIds.Except(answeredIds).ToList();
            if (missingRequired.Any())
                throw new InvalidOperationException($"Faltan respuestas obligatorias para: {string.Join(", ", missingRequired)}");

            // Validar cada respuesta
            foreach (var answer in request.Answers)
            {
                if (!questionLookup.TryGetValue(answer.QuestionId, out var question))
                    throw new InvalidOperationException($"La pregunta {answer.QuestionId} no pertenece a la encuesta.");

                switch (question.Type)
                {
                    case QuestionType.SingleChoice:
                        if (!answer.SelectedValue.HasValue)
                            throw new InvalidOperationException($"Pregunta {answer.QuestionId} requiere SelectedValue.");
                        if (!question.Options.Any(o => o.Value == answer.SelectedValue.Value))
                            throw new InvalidOperationException($"Valor {answer.SelectedValue} inválido para la pregunta {answer.QuestionId}.");
                        break;

                    case QuestionType.MultipleChoice:
                        // TODO: soporte real multivalor (lista). Por ahora aceptamos un valor.
                        if (!answer.SelectedValue.HasValue)
                            throw new InvalidOperationException($"Pregunta {answer.QuestionId} (MultipleChoice) requiere al menos un SelectedValue.");
                        if (!question.Options.Any(o => o.Value == answer.SelectedValue.Value))
                            throw new InvalidOperationException($"Valor {answer.SelectedValue} inválido para la pregunta {answer.QuestionId}.");
                        break;

                    case QuestionType.OpenText:
                        if (string.IsNullOrWhiteSpace(answer.Text))
                            throw new InvalidOperationException($"Pregunta {answer.QuestionId} requiere texto.");
                        break;

                    default:
                        throw new InvalidOperationException($"Tipo de pregunta no soportado: {question.Type}");
                }
            }

            var existingResponse = await surveyRepository
                .GetResponseAsync(request.AcademicSurveySubjectId, request.UserId, cancellationToken);

            if (existingResponse is null)
            {
                var response = new AcademicSurveyResponse
                {
                    AcademicSurveySubjectId = request.AcademicSurveySubjectId,
                    UserId = request.UserId,
                    SubmittedAt = DateTime.UtcNow,
                    QuestionResponses = request.Answers.Select(a => new SurveyQuestionResponse
                    {
                        AcademicSurveySubjectId = request.AcademicSurveySubjectId,
                        SurveyQuestionId = a.QuestionId,
                        SelectedValue = a.SelectedValue,
                        Text = a.Text
                    }).ToList()
                };

                var id = await surveyRepository.CreateResponseAsync(response, cancellationToken);
                logger.LogInformation("Nueva respuesta creada para SurveySubject {SubjectId} por usuario {UserId}", request.AcademicSurveySubjectId, request.UserId);
                return id;
            }
            else
            {
                existingResponse.SubmittedAt = DateTime.UtcNow;
                existingResponse.QuestionResponses = request.Answers.Select(a => new SurveyQuestionResponse
                {
                    AcademicSurveySubjectId = request.AcademicSurveySubjectId,
                    SurveyQuestionId = a.QuestionId,
                    SelectedValue = a.SelectedValue,
                    Text = a.Text
                }).ToList();

                await surveyRepository.UpdateResponseAsync(existingResponse, cancellationToken);
                logger.LogInformation("Respuesta actualizada para SurveySubject {SubjectId} por usuario {UserId}", request.AcademicSurveySubjectId, request.UserId);
                return existingResponse.Id;
            }
        }
    }
}