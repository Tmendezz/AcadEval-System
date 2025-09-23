using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveyQuestionOptionDto
    {
        public Guid? Id { get; set; }
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
