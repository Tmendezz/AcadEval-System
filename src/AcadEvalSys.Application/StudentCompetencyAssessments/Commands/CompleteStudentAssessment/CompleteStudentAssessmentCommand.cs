using System.Text.Json.Serialization;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;

public class CompleteStudentAssessmentCommand(): IRequest<Guid>
{
    [JsonIgnore]
    public Guid ProfessorCompetencyAssignmentId { get; set; } 

    [JsonIgnore] public string StudentId { get; set; }  = string.Empty;
    public CompetencyLevel? CompetencyLevel { get; set; } 
}