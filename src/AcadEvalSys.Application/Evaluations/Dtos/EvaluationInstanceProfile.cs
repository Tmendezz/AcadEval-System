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
                DateTime.SpecifyKind(DateTime.Parse(src.PeriodFrom.ToString()), DateTimeKind.Utc)))
            .ForMember(dest => dest.PeriodTo, opt => opt.MapFrom(src => 
                DateTime.SpecifyKind(DateTime.Parse(src.PeriodTo.ToString()), DateTimeKind.Utc)));

        CreateMap<CreateCompetencyAssignmentDto, ProfessorCompetencyAssignment>()
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true)) // Por defecto activo
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ProfessorAssignmentStatus.Pending)); // Por defecto pendiente


        CreateMap<CompetencyEvaluationInstance, EvaluationInstanceDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.OverallProgressPercentage, opt => opt.MapFrom(src =>
                src.TotalProfessorAssignmentsCount > 0
                    ? (decimal)src.CompletedProfessorAssignmentsCount / src.TotalProfessorAssignmentsCount * 100
                    : 0))
            .ForMember(dest => dest.Semester, opt => opt.MapFrom(src => src.Semester))
            .ForMember(dest => dest.AssignmentsByCareer, opt => opt.MapFrom(src =>
                src.ProfessorCompetencyAssignments
                    .GroupBy(a => a.Subject.TechnicalCareer.Name) // 1. Agrupar por carrera primero
                    .Select(careerGroup => new CompetencyAssignmentByCareerYearDto
                    {
                        CareerName = careerGroup.Key,
                        CareerId = careerGroup.First().Subject.TechnicalCareer.Id,
                        Assignments = careerGroup
                            .GroupBy(a => a.Subject.Year.ToString()) // 2. Agrupar por año dentro de cada carrera
                            .ToDictionary(
                                yearGroup => yearGroup.Key, // La clave del diccionario (ej: "First", "Second", "Third")
                                yearGroup => yearGroup.Select(a => new CompetencyAssignmentDto // El valor del diccionario (array de asignaciones)
                                {
                                    AssignmentId = a.Id,
                                    CompetencyName = a.Competency.Name,
                                    SubjectName = a.Subject.Name,
                                    ProfessorName = a.Subject.Professor.User.Name,
                                    Status = a.Status
                                }).ToArray()
                            )
                    }).ToArray()

            ));

    }

}


