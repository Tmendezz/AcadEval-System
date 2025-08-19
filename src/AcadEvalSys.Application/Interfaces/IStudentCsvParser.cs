using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using AcadEvalSys.Application.Students.Importing;

namespace AcadEvalSys.Application.Interfaces;

public interface IStudentCsvParser
{
    IEnumerable<ImportStudentRecord> Parse(IFormFile file);
}
