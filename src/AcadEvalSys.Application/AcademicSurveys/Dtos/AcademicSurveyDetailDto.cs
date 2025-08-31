using AcadEvalSys.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class AcademicSurveyDetailDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }
        public SurveyStatus Status { get; set; }
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
        public List<SurveyQuestionDto> Questions { get; set; } = new();
        public List<SurveySubjectDto> Subjects { get; set; } = new();
    }
}
