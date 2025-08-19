using System.Globalization;
using System.Text;
using AcadEvalSys.Application.Interfaces;
using AcadEvalSys.Application.Students.Importing;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;

namespace AcadEvalSys.Application.Services;

public class StudentCsvParser : IStudentCsvParser
{
    public IEnumerable<ImportStudentRecord> Parse(IFormFile file)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            BadDataFound = null,
            TrimOptions = TrimOptions.Trim,
            HeaderValidated = null // Ignore missing header validation; mapping handles known variants
        };

        using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
        using var csv = new CsvReader(reader, config);
        csv.Context.RegisterClassMap<ImportStudentRecordMap>();
        return csv.GetRecords<ImportStudentRecord>().ToList();
    }
}
