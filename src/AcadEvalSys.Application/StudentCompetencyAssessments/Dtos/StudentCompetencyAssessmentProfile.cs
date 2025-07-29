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
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src =>
                src.Student!.User!.Name))
            .ForMember(dest => dest.StudentEmail, opt => opt.MapFrom(src => src.Student!.User!.Email))
            .ForMember(dest => dest.CompetencyLevelDescription, opt => opt.MapFrom(src =>
                src.ProfessorCompetencyAssignment.Competency.LevelDescriptions
                    .Where(ld => ld.Level == src.CompetencyLevel)
                    .Select(ld => ld.Description)
                    .FirstOrDefault() ?? "Sin Evaluar"))
            .ForMember(dest => dest.CompetencyLevel, opt => opt.MapFrom(src => src.CompetencyLevel))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

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
                
                var result = new CompetencyAssessmentGroupDto
                {
                    SubjectName = subjectName ?? string.Empty,
                    CompetencyName = competencyName ?? string.Empty,
                    StudentEvaluations = context.Mapper.Map<IEnumerable<StudentCompetencyEvaluationDto>>(studentCompetencyAssessments),
                    EvaluatedStudentsCount = evaluatedCount,
                    ProgressPercentage = progressPercentage,
                    Status = assignmentStatus
                };
                
                return result;
            });

    }
}