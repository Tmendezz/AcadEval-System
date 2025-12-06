using CsvHelper.Configuration;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Students.Importing;

public sealed class ImportStudentRecordMap : ClassMap<ImportStudentRecord>
{
    public ImportStudentRecordMap()
    {
        Map(m => m.Email)
            .Name("Email")
            .Validate(args => !string.IsNullOrWhiteSpace(args.Field));

        Map(m => m.Name)
            .Name("Nombre", "Name")
            .Validate(args => !string.IsNullOrWhiteSpace(args.Field));

        Map(m => m.Password)
            .Name("Contraseña", "Password")
            .Optional();

        Map(m => m.CurrentYear)
            .Name("Año", "Anio", "Year", "current_year")
            .Convert(args =>
            {
                string? raw = null;
                if (args.Row.TryGetField<string>("Año", out var a1)) raw = a1;
                else if (args.Row.TryGetField<string>("Anio", out var a2)) raw = a2;
                else if (args.Row.TryGetField<string>("Year", out var a3)) raw = a3;
                else if (args.Row.TryGetField<string>("current_year", out var a4)) raw = a4;
                raw = (raw ?? string.Empty).Trim();

                if (string.IsNullOrWhiteSpace(raw)) return "First";

                switch (raw)
                {
                    case "1":
                    case "Primero":
                    case "primero":
                    case "First":
                    case "first":
                        return nameof(CareerYear.First);
                    case "2":
                    case "Segundo":
                    case "segundo":
                    case "Second":
                    case "second":
                        return nameof(CareerYear.Second);
                    case "3":
                    case "Tercero":
                    case "tercero":
                    case "Third":
                    case "third":
                        return nameof(CareerYear.Third);
                    default:
                        return raw;
                }
            });
    }
}
