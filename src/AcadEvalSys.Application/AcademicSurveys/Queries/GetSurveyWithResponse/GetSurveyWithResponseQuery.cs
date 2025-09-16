using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyWithResponse;

public class GetSurveyWithResponseQuery : IRequest<SurveyWithResponseDto?>
{
    public Guid SurveySubjectId { get; set; }
    public bool ReadOnly { get; set; } = false; // Para indicar si es vista de solo lectura
}

public class SurveyWithResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Status { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public bool IsReadOnly { get; set; }
    public bool HasResponded { get; set; }
    public DateTime? RespondedAt { get; set; }
    public Guid SurveySubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public List<SurveyQuestionWithResponseDto> Questions { get; set; } = new();
}

public class SurveyQuestionWithResponseDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int Type { get; set; }
    public bool IsRequired { get; set; }
    public int? Order { get; set; }
    public List<SurveyQuestionOptionDto> Options { get; set; } = new();
    public SurveyQuestionResponseDto? Response { get; set; }
}

public class SurveyQuestionOptionDto
{
    public int Value { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool AllowOpenText { get; set; }
    public int? Order { get; set; }
}

public class SurveyQuestionResponseDto
{
    public int? SelectedValue { get; set; }
    public string? Text { get; set; }
}
