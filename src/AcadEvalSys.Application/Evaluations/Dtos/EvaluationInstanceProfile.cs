using AcadEvalSys.Application.Evaluations.Commands.CreateInstance;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AutoMapper;

namespace AcadEvalSys.Application.Evaluations.Dtos;

public class EvaluationInstanceProfile : Profile
{
    public EvaluationInstanceProfile()
    {
        CreateMap<CreateEvaluationInstanceCommand, CompetencyEvaluationInstance>();

        // Agregar el mapeo faltante para CreateCompetencyAssignmentDto a ProfessorCompetencyAssignment
        CreateMap<CreateCompetencyAssignmentDto, ProfessorCompetencyAssignment>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar Id ya que se genera automáticamente
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Se establece manualmente
            .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore()) // Se establece manualmente
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // Se establece manualmente
            .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore()) // Se establece manualmente
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true)) // Por defecto activo
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ProfessorAssignmentStatus.Pending)) // Por defecto pendiente
            .ForMember(dest => dest.CompetencyEvaluationInstanceId, opt => opt.Ignore()) // Se establece manualmente
            .ForMember(dest => dest.CompetencyEvaluationInstance, opt => opt.Ignore()) // Ignorar navegación
            .ForMember(dest => dest.Competency, opt => opt.Ignore()) // Ignorar navegación
            .ForMember(dest => dest.Subject, opt => opt.Ignore()) // Ignorar navegación
            .ForMember(dest => dest.StudentCompetencyAssessments, opt => opt.Ignore()); // Ignorar navegación

        CreateMap<CompetencyEvaluationInstance, EvaluationInstanceDto>()
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


