using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class FormQuestion : BaseEntity
    {
        //Preguntas de la encuesta
        public string? Text { get; set; }
        public int Orden { get; set; } = 0;
        public QuestionType QuestionType { get; set; } = QuestionType.SingleChoice;
    }
}
