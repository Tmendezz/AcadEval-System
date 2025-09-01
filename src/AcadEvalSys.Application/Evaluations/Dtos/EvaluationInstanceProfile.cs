using AcadEvalSys.Application.Evaluations.Commands.CreateInstance;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AutoMapper;

namespace AcadEvalSys.Application.Evaluations.Dtos;

public class EvaluationInstanceProfile : Profile
{
    public EvaluationInstanceProfile()
    {
   CreateMap<CreateEvaluationInstanceCommand, CompetencyEvaluationInstance>()
            .ForMember(dest => dest.PeriodFrom, opt => opt.MapFrom(src =>
                DateTime.SpecifyKind(src.PeriodFrom, DateTimeKind.Utc)))
            .ForMember(dest => dest.PeriodTo, opt => opt.MapFrom(src =>
                DateTime.SpecifyKind(src.PeriodTo, DateTimeKind.Utc)));

        CreateMap<CreateCompetencyAssignmentDto, ProfessorCompetencyAssignment>()
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => ProfessorAssignmentStatus.Pending));

        CreateMap<CompetencyEvaluationInstance, EvaluationInstanceDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.CreatedByUserId, opt => opt.MapFrom(src => src.CreatedByUserId))
            .ForMember(dest => dest.OverallProgressPercentage, opt => opt.MapFrom(src =>
                src.TotalProfessorAssignmentsCount > 0
                    ? (decimal)src.CompletedProfessorAssignmentsCount / src.TotalProfessorAssignmentsCount * 100
                    : 0))
            .ForMember(dest => dest.Semester, opt => opt.MapFrom(src => src.Semester))
            .ForMember(dest => dest.AssignmentsByCareer, opt => opt.MapFrom(src =>
                (src.ProfessorCompetencyAssignments ?? Enumerable.Empty<ProfessorCompetencyAssignment>())
                    .Where(a => a.Subject != null && a.Subject.TechnicalCareer != null)
                    .GroupBy(a => a.Subject!.TechnicalCareer!.Name ?? "Sin carrera")
                    .Select(careerGroup => new CompetencyAssignmentByCareerYearDto
                    {
                        CareerName = careerGroup.Key,
                        CareerId = careerGroup
                            .Select(x => x.Subject!.TechnicalCareer!.Id)
                            .FirstOrDefault(),
                        Assignments = careerGroup
                            .GroupBy(a => (a.Subject!.Year).ToString())
                            .ToDictionary(
                                yearGroup => yearGroup.Key,
                                yearGroup => yearGroup.Select(a => new CompetencyAssignmentDto
                                {
                                    AssignmentId = a.Id,
                                    CompetencyName = a.Competency != null ? a.Competency.Name : "Sin competencia",
                                    SubjectName = a.Subject != null ? a.Subject.Name : "Sin materia",
                                    ProfessorName = (a.Subject != null && a.Subject.Professor != null && a.Subject.Professor.User != null) ? a.Subject.Professor.User.Name : "Sin profesor",
                                    Status = a.Status
                                }).ToArray()
                            )
                    }).ToArray()
            ));

    }

}
