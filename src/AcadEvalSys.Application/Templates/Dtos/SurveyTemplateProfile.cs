using AutoMapper;
using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateProfile : Profile
    {
        public SurveyTemplateProfile()
        {
            // Mapping para lectura completa de template
            CreateMap<SurveyTemplate, SurveyTemplateReadDto>()
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.OrderBy(q => q.Order)));

            // Mapping para listado de templates
            CreateMap<SurveyTemplate, SurveyTemplateListItemDto>()
                .ForMember(dest => dest.UpdatedAtOrCreatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt));

            // Mapping para preguntas
            CreateMap<SurveyTemplateQuestion, SurveyTemplateQuestionDto>()
                .ForMember(dest => dest.Required, opt => opt.MapFrom(src => src.isRequired))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options.OrderBy(o => o.Order)));

            // Mapping para opciones de preguntas
            CreateMap<SurveyTemplateQuestionOption, SurveyTemplateOptionDto>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Value.ToString()));

            // Reverse mappings para commands (Create/Update)
            CreateMap<SurveyTemplateQuestionDto, SurveyTemplateQuestion>()
                .ForMember(dest => dest.isRequired, opt => opt.MapFrom(src => src.Required))
                .ForMember(dest => dest.TemplateId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplate, opt => opt.Ignore());

            CreateMap<SurveyTemplateOptionDto, SurveyTemplateQuestionOption>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => int.Parse(src.Value)))
                .ForMember(dest => dest.TemplateQuestionId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplateQuestion, opt => opt.Ignore());
        }
    }
}