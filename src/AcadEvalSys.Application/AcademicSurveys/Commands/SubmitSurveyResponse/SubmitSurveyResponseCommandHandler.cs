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
            foreach (var ans in request.Answers)
            {
                if (!questionsById.TryGetValue(ans.QuestionId, out var q))
                    throw new InvalidOperationException($"La pregunta {ans.QuestionId} no pertenece a esta encuesta.");

                switch (q.Type)
                {
                    case QuestionType.OpenText:
                        if (string.IsNullOrWhiteSpace(ans.Text))
                            throw new InvalidOperationException($"La pregunta '{q.Text}' requiere texto abierto.");
                        ans.SelectedValue = null;
                        break;
                    case QuestionType.SingleChoice:
                    case QuestionType.MultipleChoice:
                        if (!ans.SelectedValue.HasValue)
                            throw new InvalidOperationException($"La pregunta '{q.Text}' requiere un valor seleccionado.");
                        if (!q.Options.Any(o => o.Value == ans.SelectedValue.Value))
                            throw new InvalidOperationException($"La opción seleccionada no es válida para la pregunta '{q.Text}'.");
                        break;
                    default:
                        throw new InvalidOperationException($"Tipo de pregunta no soportado: {q.Type}");
                }
            }

            var existing = await surveyRepo.GetResponseAsync(request.AcademicSurveySubjectId, currentUserId, ct);

            if (existing is not null)
            {
                existing.QuestionResponses = MapAnswers(request);
                existing.SubmittedAt = DateTime.UtcNow;
                existing.UpdatedAt = DateTime.UtcNow;
                await surveyRepo.UpdateResponseAsync(existing, ct);
                return existing.Id;
            }
            else
            {
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
