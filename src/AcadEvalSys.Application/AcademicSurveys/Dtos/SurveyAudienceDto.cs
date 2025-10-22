using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos;

public class CreateSurveyAudienceDto
{
    public Guid TechnicalCareerId { get; set; }
    public List<CareerYear> SelectedYears { get; set; } = new();
}

public class SurveyAudienceDto
{
    public Guid TechnicalCareerId { get; set; }
    public string CareerName { get; set; } = string.Empty;
    public List<CareerYear> SelectedYears { get; set; } = new();
}