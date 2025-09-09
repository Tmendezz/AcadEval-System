using AcadEvalSys.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class TemplateQuestionDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public int? Order { get; set; }
        public bool IsRequired { get; set; }
        public List<TemplateQuestionOptionDto> Options { get; set; } = new();
    }
}
