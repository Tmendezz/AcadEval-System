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

            // Validar que el subject pertenezca a la encuesta
            var surveySubject = survey.Subjects.FirstOrDefault(s => s.Id == request.SurveySubjectId);
            if (surveySubject == null)
            {
                throw new InvalidOperationException("El surveySubject no pertenece a la encuesta");
            }

            // Procesar SelectedValues antes de validar y mapear
            // Para preguntas de opción múltiple, convertir SelectedValues a Text (JSON) y SelectedValue (primer valor)
            if (request.SubjectAnswers != null)
            {
                foreach (var answer in request.SubjectAnswers)
                {
                    // Si hay SelectedValues, procesarlos para preguntas de opción múltiple
                    if (answer.SelectedValues != null && answer.SelectedValues.Any())
                    {
                        var question = survey.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                        if (question != null && question.Type == QuestionType.MultipleChoice)
                        {
                            // Almacenar los valores múltiples como JSON en Text
                            answer.Text = System.Text.Json.JsonSerializer.Serialize(answer.SelectedValues);
                            // Establecer SelectedValue con el primer valor para compatibilidad
                            answer.SelectedValue = answer.SelectedValues.First();
                        }
                    }
                }
            }

            // Validar respuestas
            ValidateResponses(survey, request.SubjectAnswers ?? new List<SubmitSurveyAnswerDto>());

            // Verificar si ya existe una respuesta para este subject
            var existingResponse = await responseRepository.GetResponseBySurveySubjectAndUserAsync(
                request.SurveySubjectId, 
                user.Id, 
                ct);

            var mappedResponses = mapper.Map<List<SurveyQuestionResponse>>(request.SubjectAnswers);

            if (existingResponse != null)
            {
                // Actualizar respuesta existente
                logger.LogInformation("Actualizando respuesta existente {ResponseId} para surveySubject {SurveySubjectId}", 
                    existingResponse.Id, request.SurveySubjectId);
                
                existingResponse.QuestionResponses = mappedResponses;
                existingResponse.SubmittedAt = DateTime.UtcNow;
                existingResponse.UpdatedAt = DateTime.UtcNow;
                
                await responseRepository.UpdateResponseAsync(existingResponse, ct);
                return existingResponse.Id;
            }
            else
            {
                // Crear nueva respuesta
                logger.LogInformation("Creando nueva respuesta para surveySubject {SurveySubjectId}", request.SurveySubjectId);
                
                var response = new AcademicSurveyResponse
                {
                    AcademicSurveySubjectId = request.SurveySubjectId,
                    UserId = user.Id,
                    SubmittedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    QuestionResponses = mappedResponses
                };

                return await responseRepository.CreateResponseAsync(response, ct);
            }
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
                        // Para preguntas de opción múltiple, aceptar SelectedValues o SelectedValue
                        if (question.IsRequired)
                        {
                            var hasSelectedValues = answer.SelectedValues != null && answer.SelectedValues.Any();
                            var hasSelectedValue = answer.SelectedValue.HasValue;
                            
                            if (!hasSelectedValues && !hasSelectedValue)
                            {
                                throw new InvalidOperationException($"La pregunta obligatoria '{question.Text}' requiere seleccionar al menos una opción");
                            }
                        }
                        
                        // Validar SelectedValues si se proporciona
                        if (answer.SelectedValues != null && answer.SelectedValues.Any())
                        {
                            foreach (var value in answer.SelectedValues)
                            {
                                if (!question.Options.Any(o => o.Value == value))
                                {
                                    throw new InvalidOperationException($"La opción seleccionada {value} no es válida para la pregunta '{question.Text}'");
                                }
                            }
                        }
                        
                        // Validar SelectedValue si se proporciona (compatibilidad con respuestas antiguas)
                        if (answer.SelectedValue.HasValue && !question.Options.Any(o => o.Value == answer.SelectedValue.Value))
                        {
                            throw new InvalidOperationException($"La opción seleccionada no es válida para la pregunta '{question.Text}'");
                        }

                        // Validar comentario/texto adicional solo si está permitido en la pregunta
                        // NO validar si el Text es JSON de SelectedValues (almacenamiento interno)
                        if (!string.IsNullOrWhiteSpace(answer.Text))
                        {
                            // Verificar si el Text es JSON de SelectedValues
                            // Si hay SelectedValues y el Text es un JSON array válido, es almacenamiento interno
                            var isJsonArrayOfValues = false;
                            if (answer.SelectedValues != null && answer.SelectedValues.Any())
                            {
                                try
                                {
                                    var textTrimmed = answer.Text.Trim();
                                    if (textTrimmed.StartsWith("[") && textTrimmed.EndsWith("]"))
                                    {
                                    var deserialized = System.Text.Json.JsonSerializer.Deserialize<List<int>>(textTrimmed);
                                    if (deserialized != null && 
                                        deserialized.Count == answer.SelectedValues.Count &&
                                        deserialized.OrderBy(x => x).SequenceEqual(answer.SelectedValues.OrderBy(x => x)))
                                    {
                                        isJsonArrayOfValues = true;
                                    }
                                    }
                                }
                                catch
                                {
                                    // Si no se puede deserializar, no es JSON de SelectedValues
                                    isJsonArrayOfValues = false;
                                }
                            }
                            
                            // Si es JSON de SelectedValues, no validar como comentario
                            if (!isJsonArrayOfValues)
                            {
                                var allowsComment = question.AllowComment;
                                // O si alguna de las opciones seleccionadas permite texto abierto
                                if (!allowsComment)
                                {
                                    var selectedValues = answer.SelectedValues ?? (answer.SelectedValue.HasValue ? new List<int> { answer.SelectedValue.Value } : new List<int>());
                                    foreach (var value in selectedValues)
                                    {
                                        var opt = question.Options.FirstOrDefault(o => o.Value == value);
                                        if (opt != null && opt.AllowOpenText)
                                        {
                                            allowsComment = true;
                                            break;
                                        }
                                    }
                                }

                                if (!allowsComment)
                                {
                                    throw new InvalidOperationException($"No se permite texto adicional para la pregunta '{question.Text}'");
                                }
                            }
                        }
                        break;
                    case QuestionType.SingleChoice:
                        // Para preguntas de opción única, solo aceptar SelectedValue
                        if (question.IsRequired && !answer.SelectedValue.HasValue)
                        {
                            throw new InvalidOperationException($"La pregunta obligatoria '{question.Text}' requiere seleccionar una opción");
                        }
                        if (answer.SelectedValue.HasValue && !question.Options.Any(o => o.Value == answer.SelectedValue.Value))
                        {
                            throw new InvalidOperationException($"La opción seleccionada no es válida para la pregunta '{question.Text}'");
                        }

                        // Validar comentario/texto adicional solo si está permitido en la pregunta
                        if (!string.IsNullOrWhiteSpace(answer.Text))
                        {
                            var allowsComment = question.AllowComment;
                            // O si la opción seleccionada permite texto abierto
                            if (!allowsComment && answer.SelectedValue.HasValue)
                            {
                                var opt = question.Options.FirstOrDefault(o => o.Value == answer.SelectedValue.Value);
                                if (opt != null)
                                {
                                    allowsComment = opt.AllowOpenText;
                                }
                            }

                            if (!allowsComment)
                            {
                                throw new InvalidOperationException($"No se permite texto adicional para la pregunta '{question.Text}'");
                            }
                        }
                        break;
                    default:
                        throw new InvalidOperationException($"Tipo de pregunta no soportado: {question.Type}");
                }
            }
        }

        
    }
}
