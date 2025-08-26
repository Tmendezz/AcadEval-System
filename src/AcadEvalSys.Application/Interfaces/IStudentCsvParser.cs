using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using AcadEvalSys.Application.Students.Importing;

namespace AcadEvalSys.Application.Interfaces;

public interface IStudentExcelParser
{
    IEnumerable<ImportStudentRecord> Parse(IFormFile file);
}
