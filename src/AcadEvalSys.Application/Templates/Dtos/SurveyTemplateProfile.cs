using AutoMapper;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Application.Templates.Commands.CreateTemplate;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class SurveyTemplateProfile : Profile
    {
        public SurveyTemplateProfile()
        {
            // Mapping para lectura completa de template
            CreateMap<SurveyTemplate, SurveyTemplateReadDto>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title)) // FIX: Mapear Title a Name
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.OrderBy(q => q.Order)));

            // Mapping para listado de templates
            CreateMap<SurveyTemplate, SurveyTemplateListItemDto>()
                .ForMember(dest => dest.UpdatedAtOrCreatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt))
                .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.Questions.Count));

            // Mapping para preguntas
            CreateMap<SurveyTemplateQuestion, SurveyTemplateQuestionDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.Required, opt => opt.MapFrom(src => src.isRequired))
                .ForMember(dest => dest.AllowComment, opt => opt.MapFrom(src => src.AllowComment))
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options.OrderBy(o => o.Order)));

            // Mapping para opciones de preguntas
            CreateMap<SurveyTemplateQuestionOption, SurveyTemplateOptionDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Value))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(src => src.Text))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.AllowOpenText, opt => opt.MapFrom(src => src.AllowOpenText));

            // Mapping para crear plantilla - ADDED
            CreateMap<CreateSurveyTemplateDto, SurveyTemplate>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.Version, opt => opt.Ignore())
                .ForMember(dest => dest.RowVersion, opt => opt.Ignore())
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));

            // Mapping para command de crear plantilla
            CreateMap<CreateSurveyTemplateCommand, SurveyTemplate>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.Version, opt => opt.Ignore())
                .ForMember(dest => dest.RowVersion, opt => opt.Ignore())
                .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));

            // Reverse mappings para commands (Create/Update)
            CreateMap<SurveyTemplateQuestionDto, SurveyTemplateQuestion>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.isRequired, opt => opt.MapFrom(src => src.Required))
                .ForMember(dest => dest.AllowComment, opt => opt.MapFrom(src => src.AllowComment))
                .ForMember(dest => dest.TemplateId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplate, opt => opt.Ignore())
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options));

            // Mapping para UpdateSurveyTemplateQuestionDto
            CreateMap<UpdateSurveyTemplateQuestionDto, SurveyTemplateQuestion>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<QuestionType>(src.Type)))
                .ForMember(dest => dest.isRequired, opt => opt.MapFrom(src => src.IsRequired))
                .ForMember(dest => dest.AllowComment, opt => opt.MapFrom(src => src.AllowComment))
                .ForMember(dest => dest.TemplateId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplate, opt => opt.Ignore())
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options));

            // Mapping para UpdateSurveyTemplateQuestionOptionDto
            CreateMap<UpdateSurveyTemplateQuestionOptionDto, SurveyTemplateQuestionOption>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Value))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.TemplateQuestionId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplateQuestion, opt => opt.Ignore());

            CreateMap<SurveyTemplateOptionDto, SurveyTemplateQuestionOption>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Value))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.TemplateQuestionId, opt => opt.Ignore())
                .ForMember(dest => dest.SurveyTemplateQuestion, opt => opt.Ignore());
        }

    }
}