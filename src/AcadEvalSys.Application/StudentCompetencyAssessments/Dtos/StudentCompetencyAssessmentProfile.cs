using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AutoMapper;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;

public class StudentCompetencyAssessmentProfile : Profile
{
    public StudentCompetencyAssessmentProfile()
    {
        CreateMap<CompleteStudentAssessmentCommand, StudentCompetencyAssessment>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => AssessmentStatus.Completed))
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Mapeo para la evaluación individual del estudiante
        CreateMap<StudentCompetencyAssessment, StudentCompetencyEvaluationDto>()
            .ForMember(dest => dest.StudentCompetencyAssessmentId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.StudentId))
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src =>
                src.Student!.User!.Name))
            .ForMember(dest => dest.StudentEmail, opt => opt.MapFrom(src => src.Student!.User!.Email))
            .ForMember(dest => dest.CompetencyLevelDescription, opt => opt.MapFrom(src =>
                src.ProfessorCompetencyAssignment.Competency.LevelDescriptions
                    .Where(ld => ld.Level == src.CompetencyLevel)
                    .Select(ld => ld.Description)
                    .FirstOrDefault() ?? "Sin calificar"))
            .ForMember(dest => dest.CompetencyLevel, opt => opt.MapFrom(src => src.CompetencyLevel))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));


        // Mapeo para evaluaciones recibidas por el estudiante
        CreateMap<StudentCompetencyAssessment, StudentReceivedEvaluationDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CompetencyName, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.Competency.Name))
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.Subject.Name))
            .ForMember(dest => dest.CareerName, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.Subject.TechnicalCareer.Name))
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.Subject.Year.ToString()))
            .ForMember(dest => dest.ProfessorName, opt => opt.MapFrom(src => "Profesor Asignado")) // TODO: Implementar obtención del nombre del profesor
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.CompetencyLevel, opt => opt.MapFrom(src => src.CompetencyLevel))
            .ForMember(dest => dest.AssessmentDate, opt => opt.MapFrom(src => src.CompletedAt))
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.CompetencyEvaluationInstance.PeriodTo))
            .ForMember(dest => dest.Observations, opt => opt.MapFrom(src => src.Observations))
            .ForMember(dest => dest.EvaluationInstanceTitle, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.CompetencyEvaluationInstance.Title))
            .ForMember(dest => dest.EvaluationInstanceDescription, opt => opt.MapFrom(src => src.ProfessorCompetencyAssignment.CompetencyEvaluationInstance.Description));

        // Mapeo desde una colección de StudentCompetencyAssessment a un CompetencyAssessmentGroupDto
        CreateMap<IEnumerable<StudentCompetencyAssessment>, CompetencyAssessmentGroupDto>()
            .ConvertUsing((src, dest, context) =>
            {
                var studentCompetencyAssessments = src.ToList();
                
                if (!studentCompetencyAssessments.Any())
                    return new CompetencyAssessmentGroupDto();

                var firstAssessment = studentCompetencyAssessments.First();
                var subjectName = firstAssessment.ProfessorCompetencyAssignment?.Subject?.Name;
                var competencyName = firstAssessment.ProfessorCompetencyAssignment?.Competency?.Name;
                
                var evaluatedCount = studentCompetencyAssessments.Count(s => s.Status == AssessmentStatus.Completed);
                var totalCount = studentCompetencyAssessments.Count;
                var progressPercentage = totalCount > 0 ? evaluatedCount * 100m / totalCount : 0;
                
                // Usar el status real persistido en la base de datos
                var assignmentStatus = firstAssessment.ProfessorCompetencyAssignment?.Status ?? ProfessorAssignmentStatus.Pending;
                
                var studentEvaluations = context.Mapper.Map<IEnumerable<StudentCompetencyEvaluationDto>>(studentCompetencyAssessments);
                
                var result = new CompetencyAssessmentGroupDto
                {
                    SubjectName = subjectName ?? string.Empty,
                    CompetencyName = competencyName ?? string.Empty,
                    StudentEvaluations = studentEvaluations,
                    EvaluatedStudentsCount = evaluatedCount,
                    ProgressPercentage = progressPercentage,
                    Status = assignmentStatus
                };
                
                return result;
            });

    }
}