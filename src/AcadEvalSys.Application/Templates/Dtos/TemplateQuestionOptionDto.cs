using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class TemplateQuestionOptionDto
    {
        public Guid Id { get; set; }
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
        public int? Order { get; set; }
        public bool AllowOpenText { get; set; }
    }
}
