using AcadEvalSys.Domain.Entities;
using AutoMapper;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class AcademicSurveysResponsesProfile : Profile
{
    public AcademicSurveysResponsesProfile()
    {
        // Mapeo de tupla (AcademicSurvey, bool, DateTime?) a UserSurveyDto
        CreateMap<(AcademicSurvey Survey, bool HasResponse, DateTime? SubmittedAt), UserSurveyDto>()
            .ForMember(d => d.SurveyId, o => o.MapFrom(s => s.Survey.Id))
            .ForMember(d => d.Title, o => o.MapFrom(s => s.Survey.Title))
            .ForMember(d => d.Description, o => o.MapFrom(s => s.Survey.Description))
            .ForMember(d => d.PublishAt, o => o.MapFrom(s => s.Survey.PublishAt))
            .ForMember(d => d.CloseAt, o => o.MapFrom(s => s.Survey.CloseAt))
            .ForMember(d => d.IsCompleted, o => o.MapFrom(s => s.HasResponse))
            .ForMember(d => d.SubmittedAt, o => o.MapFrom(s => s.SubmittedAt))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Survey.Status))
            .ForMember(d => d.SurveyType, o => o.MapFrom(s => s.Survey.SurveyType));

        // Mapeo de AcademicSurvey a SurveyForResponseDto (para responder)
        CreateMap<AcademicSurvey, SurveyForResponseDto>()
            .ForMember(d => d.SurveyId, o => o.MapFrom(s => s.Id))
            .ForMember(d => d.Questions, o => o.MapFrom(s => s.Questions.OrderBy(q => q.Order)));

        // Mapeo de SurveyQuestion a SurveyQuestionForResponseDto
        CreateMap<SurveyQuestion, SurveyQuestionForResponseDto>()
            .ForMember(d => d.Options, o => o.MapFrom(s => s.Options.OrderBy(x => x.Value)));

        // Mapeo de SurveyQuestionOption a SurveyQuestionOptionForResponseDto
        CreateMap<SurveyQuestionOption, SurveyQuestionOptionForResponseDto>();

        // Mapeo de SubmitSurveyAnswerDto a SurveyQuestionResponse 
        CreateMap<SubmitSurveyAnswerDto, SurveyQuestionResponse>()
            .ForMember(d => d.SurveyQuestionId, o => o.MapFrom(s => s.QuestionId))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.IsActive, o => o.MapFrom(_ => true));
    }
}