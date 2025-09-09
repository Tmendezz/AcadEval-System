using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurvey
{
    public class GetAcademicSurveyByIdQuery : IRequest<AcademicSurveyDetailDto?>
    {
        public Guid Id { get; set; }
    }
}
