using MediatR;
using Microsoft.AspNetCore.Http;
using AcadEvalSys.Application.Subjects.Dtos;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.ImportStudents;

public class ImportStudentsToCareerCommand : IRequest<ImportStudentsResultDto>
{
    public Guid TechnicalCareerId { get; set; }
    public IFormFile File { get; set; } = default!;
}
