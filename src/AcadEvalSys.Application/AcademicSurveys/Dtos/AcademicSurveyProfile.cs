using AcadEvalSys.Domain.Entities;
using AutoMapper;
using AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class AcademicSurveyProfile : Profile
    {
        public AcademicSurveyProfile()
        {
            CreateMap<CreateAcademicSurveyCommand, AcademicSurvey>();

            // Mapeos de entidad a DTO (para consultas)
            CreateMap<SurveyQuestion, SurveyQuestionDto>()
                .ForMember(d => d.Options, o => o.MapFrom(s => s.Options.OrderBy(x => x.Value)))
                .ForMember(d => d.AllowComment, o => o.MapFrom(s => s.AllowComment));

            CreateMap<SurveyQuestionOption, SurveyQuestionOptionDto>();

            // Mapeos de DTO a entidad (para comandos)
            CreateMap<SurveyQuestionDto, SurveyQuestion>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.AcademicSurveyId, o => o.Ignore())
                .ForMember(d => d.AcademicSurvey, o => o.Ignore())
                .ForMember(d => d.CreatedAt, o => o.Ignore())
                .ForMember(d => d.UpdatedAt, o => o.Ignore())
                .ForMember(d => d.CreatedByUserId, o => o.Ignore())
                .ForMember(d => d.UpdatedByUserId, o => o.Ignore())
                .ForMember(d => d.CreatedByUser, o => o.Ignore())
                .ForMember(d => d.UpdatedByUser, o => o.Ignore())
                .ForMember(d => d.IsActive, o => o.Ignore());

            CreateMap<SurveyQuestionOptionDto, SurveyQuestionOption>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.SurveyQuestionId, o => o.Ignore())
                .ForMember(d => d.SurveyQuestion, o => o.Ignore())
                .ForMember(d => d.CreatedAt, o => o.Ignore())
                .ForMember(d => d.UpdatedAt, o => o.Ignore())
                .ForMember(d => d.CreatedByUserId, o => o.Ignore())
                .ForMember(d => d.UpdatedByUserId, o => o.Ignore())
                .ForMember(d => d.CreatedByUser, o => o.Ignore())
                .ForMember(d => d.UpdatedByUser, o => o.Ignore())
                .ForMember(d => d.IsActive, o => o.Ignore());

            CreateMap<AcademicSurvey, AcademicSurveyDto>()
                .ForMember(d => d.Questions, o => o.MapFrom(s => s.Questions.OrderBy(q => q.Order)))
                .ForMember(d => d.Audience, o => o.MapFrom(s => s.Subjects
                    .Where(sub => sub.Subject != null && sub.Subject.TechnicalCareer != null && sub.Subject.TechnicalCareerId.HasValue)
                    .GroupBy(sub => new { sub.Subject!.TechnicalCareerId, sub.Subject.TechnicalCareer!.Name })
                    .Select(g => new SurveyAudienceDto
                    {
                        TechnicalCareerId = g.Key.TechnicalCareerId!.Value,
                        CareerName = g.Key.Name ?? string.Empty,
                        SelectedYears = g.Select(sub => sub.Subject!.Year).Distinct().OrderBy(y => y).ToList()
                    })
                    .OrderBy(a => a.CareerName)
                    .ToList()));

            // Analytics mapping (base fields + grouped structure; responses/rates filled in handler)
            CreateMap<AcademicSurvey, SurveyAnalyticsDto>()
                .ForMember(d => d.CreatedByUserName, o => o.MapFrom(s => s.CreatedByUser != null ? s.CreatedByUser.UserName : string.Empty))
                .ForMember(d => d.TotalQuestions, o => o.MapFrom(s => s.Questions.Count))
                .ForMember(d => d.TotalAudiences, o => o.Ignore())
                .ForMember(d => d.TotalResponses, o => o.Ignore())
                .ForMember(d => d.ResponseRate, o => o.Ignore())
                .ForMember(d => d.CareerAnalytics, o => o.MapFrom(s => s.Subjects
                    .Where(ss => ss.SubjectId != null && ss.Subject != null && ss.Subject.TechnicalCareer != null && ss.Subject.TechnicalCareerId.HasValue)
                    .GroupBy(ss => ss.Subject!.TechnicalCareerId!.Value)
                    .Select(cg => new CareerAnalyticsDto
                    {
                        TechnicalCareerId = cg.Key,
                        CareerName = cg.First().Subject!.TechnicalCareer!.Name,
                        CareerYear = cg.GroupBy(yg => yg.Subject!.Year)
                            .Select(yg => new YearAnalyticsDto
                            {
                                Year = yg.Key,
                                YearName = yg.Key.ToString(),
                                SubjectsCount = yg.Count(),
                                StudentsCount = yg.Sum(ss => ss.Subject != null && ss.Subject.StudentSubjects != null ? ss.Subject.StudentSubjects.Count : 0),
                                ProfessorsCount = yg.Count(ss => ss.Subject != null && !string.IsNullOrEmpty(ss.Subject.ProfessorId)),
                                ResponsesCount = 0,
                                ResponseRate = 0
                            })
                            .OrderBy(y => y.Year)
                            .ToList()
                    })
                    .OrderBy(c => c.CareerName)
                    .ToList()
                ));
        }
    }
}
