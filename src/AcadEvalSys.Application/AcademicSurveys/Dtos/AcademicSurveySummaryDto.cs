using AcadEvalSys.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class AcademicSurveySummaryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public SurveyStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
    }
}
