using AcadEvalSys.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveyQuestionDto
    {
        public Guid? Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public int? Order { get; set; }
        public bool IsRequired { get; set; }
        public bool AllowComment { get; set; }
        public List<SurveyQuestionOptionDto> Options { get; set; } = new();
    }
}
