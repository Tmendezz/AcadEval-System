using System.Threading.Tasks;
using System;
using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Domain.Interfaces;

public interface IStudentReportGenerationService
{
    Task GenerateStudentReportAsync(string studentId, Guid evaluationInstanceId);
}
