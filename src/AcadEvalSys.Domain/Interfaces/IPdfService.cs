using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Interfaces;

public interface IPdfService
{
    Task<string> GenerateStudentReportPdf(
        Student student, 
        CompetencyEvaluationInstance instance, 
        List<StudentCompetencyAssessment> assessments
    );
}