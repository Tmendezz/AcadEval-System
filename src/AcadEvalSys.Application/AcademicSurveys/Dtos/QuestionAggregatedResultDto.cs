using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos;

public class QuestionAggregatedResultDto
{
    public Guid QuestionId { get; set; }
    public string QuestionText { get; set; } = default!;
    public QuestionType Type { get; set; } // SingleChoice, MultipleChoice, OpenText

    // Para choice/multiple choice
    public List<OptionAggregatedResultDto>? Options { get; set; }

    // Para texto libre y comentarios
    public List<string>? OpenAnswers { get; set; }
}

public class OptionAggregatedResultDto
{
    public Guid OptionId { get; set; }
    public string OptionText { get; set; } = default!;
    public double AverageScore { get; set; } // para escala
    public int Count { get; set; } // cuántos la seleccionaron
    public double Percentage { get; set; } // porcentaje de respuestas
}
