using System;
using System.Collections.Generic;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;

public class CompetencyAssessmentGroupDto
{
    public string SubjectName { get; set; } = string.Empty;
    public string CompetencyName { get; set; } = string.Empty;
    public IEnumerable<StudentCompetencyEvaluationDto> StudentEvaluations { get; set; } = [];
    public int TotalStudentsCount => StudentEvaluations.Count();
    public int EvaluatedStudentsCount { get; set; } 
    public decimal ProgressPercentage { get; set; }
    public ProfessorAssignmentStatus Status { get; set; }  
}