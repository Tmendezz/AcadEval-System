using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.ListAcademicSurveys
{
    public class ListAcademicSurveysQuery : IRequest<IReadOnlyList<AcademicSurveySummaryDto>>
    {
        public SurveyStatus? Status { get; set; }
        public Guid? TechnicalCareerId { get; set; }
        public Guid? SubjectId { get; set; }
        public string? Search { get; set; }
    }
}
