using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommandHandler(ILogger<SubmitSurveyResponseCommandHandler> logger, IAcademicSurveyRepository surveyRepo, AcadEvalSys.Application.Users.IUserContext userContext) : IRequestHandler<SubmitSurveyResponseCommand, Guid>
    {
        public async Task<Guid> Handle(SubmitSurveyResponseCommand request, CancellationToken ct)
        {
            var currentUserId = userContext.GetCurrentUser()?.Id ?? throw new UnauthorizedAccessException();
            logger.LogInformation("Registrando respuesta: SubjectId {SubjectId}, UserId {UserId}", request.AcademicSurveySubjectId, currentUserId);
            var subject = await surveyRepo.GetSubjectGraphAsync(request.AcademicSurveySubjectId, ct)
                 ?? throw new KeyNotFoundException("AcademicSurveySubject no encontrado o inactivo.");

            var survey = subject.AcademicSurvey!;
            var now = DateTime.UtcNow;
            if (survey.Status != SurveyStatus.Published ||
                (survey.PublishAt.HasValue && survey.PublishAt > now) ||
                (survey.CloseAt.HasValue && survey.CloseAt < now))
            {
                throw new InvalidOperationException("La encuesta no está disponible para responder.");
            }

            var questionsById = survey.Questions.ToDictionary(q => q.Id);
            var answersByQuestionId = request.Answers.ToDictionary(a => a.QuestionId);

            // Validar que todas las preguntas obligatorias tengan respuesta
            var requiredQuestions = survey.Questions.Where(q => q.IsRequired).ToList();
            foreach (var requiredQuestion in requiredQuestions)
            {
                if (!answersByQuestionId.ContainsKey(requiredQuestion.Id))
                {
                    throw new InvalidOperationException($"La pregunta obligatoria '{requiredQuestion.Text}' debe ser respondida.");
                }
            }

            // Validar cada respuesta
            foreach (var ans in request.Answers)
            {
                if (!questionsById.TryGetValue(ans.QuestionId, out var q))
                    throw new InvalidOperationException($"La pregunta {ans.QuestionId} no pertenece a esta encuesta.");

                // Validar contenido según tipo de pregunta
                switch (q.Type)
                {
                    case QuestionType.OpenText:
                        // Para preguntas obligatorias de texto abierto, verificar que no esté vacío
                        if (q.IsRequired && string.IsNullOrWhiteSpace(ans.Text))
                            throw new InvalidOperationException($"La pregunta obligatoria '{q.Text}' requiere una respuesta de texto.");
                        ans.SelectedValue = null;
                        break;
                    case QuestionType.SingleChoice:
                    case QuestionType.MultipleChoice:
                        // Para preguntas obligatorias de selección, verificar que tenga valor
                        if (q.IsRequired && !ans.SelectedValue.HasValue)
                            throw new InvalidOperationException($"La pregunta obligatoria '{q.Text}' requiere seleccionar una opción.");
                        if (ans.SelectedValue.HasValue && !q.Options.Any(o => o.Value == ans.SelectedValue.Value))
                            throw new InvalidOperationException($"La opción seleccionada no es válida para la pregunta '{q.Text}'.");
                        break;
                    default:
                        throw new InvalidOperationException($"Tipo de pregunta no soportado: {q.Type}");
                }
            }

            var existing = await surveyRepo.GetResponseAsync(request.AcademicSurveySubjectId, currentUserId, ct);

            if (existing is not null)
            {
                // Una vez enviada, la encuesta no puede ser modificada según User Story 2
                throw new InvalidOperationException("Esta encuesta ya ha sido respondida y no puede modificarse.");
            }

            // Crear nueva respuesta
            var response = new AcademicSurveyResponse
            {
                AcademicSurveySubjectId = request.AcademicSurveySubjectId,
                UserId = currentUserId,
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                QuestionResponses = MapAnswers(request)
            };

            return await surveyRepo.CreateResponseAsync(response, ct);
        }

        private static List<SurveyQuestionResponse> MapAnswers(SubmitSurveyResponseCommand request)
            => request.Answers.Select(a => new SurveyQuestionResponse
            {
                AcademicSurveySubjectId = request.AcademicSurveySubjectId,
                SurveyQuestionId = a.QuestionId,
                SelectedValue = a.SelectedValue,
                Text = a.Text,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            }).ToList();
    }
}
