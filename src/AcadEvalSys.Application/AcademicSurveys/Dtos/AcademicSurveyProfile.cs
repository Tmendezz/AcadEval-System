using AcadEvalSys.Domain.Entities;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class AcademicSurveyProfile : Profile
    {
        public AcademicSurveyProfile()
        {
            CreateMap<AcademicSurvey, AcademicSurveySummaryDto>();

            CreateMap<AcademicSurvey, AcademicSurveyDetailDto>()
                .ForMember(d => d.Questions, o => o.MapFrom(s => s.Questions.OrderBy(q => q.Order)))
                .ForMember(d => d.Subjects, o => o.MapFrom(s => s.Subjects));

            CreateMap<SurveyQuestion, SurveyQuestionDto>()
                .ForMember(d => d.Options, o => o.MapFrom(s => s.Options.OrderBy(x => x.Order)))
                .ForMember(d => d.AllowComment, o => o.MapFrom(s => s.AllowComment));

            CreateMap<SurveyQuestionOption, SurveyQuestionOptionDto>();

            CreateMap<AcademicSurveySubject, SurveySubjectDto>()
                .ForMember(d => d.SubjectName, o => o.MapFrom(s => s.Subject != null ? s.Subject.Name : null));

            // No podemos mapear directamente tuplas con AutoMapper, se maneja en el handler
        }
    }
}
