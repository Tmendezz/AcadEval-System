using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommand : IRequest<Guid>
    {
        public string Title { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
    }
}
