using System.Data;
using System.Globalization;
using System.Text;
using AcadEvalSys.Application.Interfaces;
using AcadEvalSys.Application.Students.Importing;
using CsvHelper;
using CsvHelper.Configuration;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;

namespace AcadEvalSys.Application.Services;

public class StudentExcelParser : IStudentExcelParser
{
    public IEnumerable<ImportStudentRecord> Parse(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var reader = ExcelReaderFactory.CreateReader(stream);
        var ds = reader.AsDataSet(new ExcelDataSetConfiguration
        {
            ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
        });

        var table = ds.Tables[0];
        var rows = new List<ImportStudentRecord>();

        string Get(DataRow r, params string[] keys)
        {
            foreach (var k in keys)
                if (table.Columns.Contains(k)) return r[k]?.ToString()?.Trim() ?? "";
            return "";
        }
        foreach (DataRow row in table.Rows)
        {
            rows.Add(new ImportStudentRecord
            {
                Email       = Get(row, "EMAIL", "email"),
                Name        = Get(row, "NOMBRE", "NOMBRE COMPLETO"),
            });
        }

        return rows;
    }
}
