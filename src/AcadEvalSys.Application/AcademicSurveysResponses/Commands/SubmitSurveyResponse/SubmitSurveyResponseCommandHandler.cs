using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommandHandler(
        ILogger<SubmitSurveyResponseCommandHandler> logger,
        IUserContext userContext,
        IAcademicSurveyRepository surveyRepository,
        IAcademicSurveyResponseRepository responseRepository,
        IMapper mapper
    ) : IRequestHandler<SubmitSurveyResponseCommand, Guid>
    {
        public async Task<Guid> Handle(SubmitSurveyResponseCommand request, CancellationToken ct)
        {
            var user = userContext.GetCurrentUser();
            if (user == null || string.IsNullOrEmpty(user.Id))
            {
                throw new UnauthorizedAccessException("Usuario no autenticado");
            }

            logger.LogInformation("Registrando respuesta para encuesta {SurveyId} por usuario {UserId}", 
                request.SurveyId, user.Id);

            // Obtener la encuesta
            var survey = await surveyRepository.GetByIdAsync(request.SurveyId, ct);
            if (survey == null)
            {
                throw new KeyNotFoundException("Encuesta no encontrada");
            }

            // Verificar que la encuesta esté disponible
            var now = DateTime.UtcNow;
            if (survey.Status != SurveyStatus.Published ||
                (survey.PublishAt.HasValue && survey.PublishAt > now) ||
                (survey.CloseAt.HasValue && survey.CloseAt < now))
            {
                throw new InvalidOperationException("La encuesta no está disponible para responder");
            }

            // Verificar que el usuario no haya respondido ya
            var hasResponded = await responseRepository.HasUserRespondedToSurveyAsync(request.SurveyId, user.Id, ct);
            if (hasResponded)
            {
                throw new InvalidOperationException("Esta encuesta ya ha sido respondida y no puede modificarse");
            }

            // Validar respuestas
            ValidateResponses(survey, request.Answers);

            // Obtener el AcademicSurveySubjectId correspondiente
            var surveySubject = survey.Subjects.FirstOrDefault();
            if (surveySubject == null)
            {
                throw new InvalidOperationException("No se encontró información de materia para esta encuesta");
            }

            // Crear la respuesta
            var response = new AcademicSurveyResponse
            {
                AcademicSurveySubjectId = surveySubject.Id,
                UserId = user.Id,
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                QuestionResponses = mapper.Map<List<SurveyQuestionResponse>>(request.Answers)
            };

            return await responseRepository.CreateResponseAsync(response, ct);
        }

        private void ValidateResponses(AcademicSurvey survey, IList<SubmitSurveyAnswerDto> answers)
        {
            var questionsById = survey.Questions.ToDictionary(q => q.Id);
            var answersByQuestionId = answers.ToDictionary(a => a.QuestionId);

            // Validar que todas las preguntas obligatorias tengan respuesta
            var requiredQuestions = survey.Questions.Where(q => q.IsRequired).ToList();
            foreach (var requiredQuestion in requiredQuestions)
            {
                if (!answersByQuestionId.ContainsKey(requiredQuestion.Id))
                {
                    throw new InvalidOperationException($"La pregunta obligatoria '{requiredQuestion.Text}' debe ser respondida");
                }
            }

            // Validar cada respuesta
            foreach (var answer in answers)
            {
                if (!questionsById.TryGetValue(answer.QuestionId, out var question))
                {
                    throw new InvalidOperationException($"La pregunta {answer.QuestionId} no pertenece a esta encuesta");
                }

                // Validar contenido según tipo de pregunta
                switch (question.Type)
                {
                    case QuestionType.OpenText:
                        if (question.IsRequired && string.IsNullOrWhiteSpace(answer.Text))
                        {
                            throw new InvalidOperationException($"La pregunta obligatoria '{question.Text}' requiere una respuesta de texto");
                        }
                        break;
                    case QuestionType.MultipleChoice:
                        if (question.IsRequired && !answer.SelectedValue.HasValue)
                        {
                            throw new InvalidOperationException($"La pregunta obligatoria '{question.Text}' requiere seleccionar una opción");
                        }
                        if (answer.SelectedValue.HasValue && !question.Options.Any(o => o.Value == answer.SelectedValue.Value))
                        {
                            throw new InvalidOperationException($"La opción seleccionada no es válida para la pregunta '{question.Text}'");
                        }
                        break;
                    default:
                        throw new InvalidOperationException($"Tipo de pregunta no soportado: {question.Type}");
                }
            }
        }

        
    }
}
