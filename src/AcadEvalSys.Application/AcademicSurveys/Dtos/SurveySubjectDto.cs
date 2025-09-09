using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveySubjectDto
    {
        public Guid Id { get; set; }
        public Guid? SubjectId { get; set; }
        public string? SubjectName { get; set; }
        public Guid AcademicSurveyId { get; set; }
    }
}
