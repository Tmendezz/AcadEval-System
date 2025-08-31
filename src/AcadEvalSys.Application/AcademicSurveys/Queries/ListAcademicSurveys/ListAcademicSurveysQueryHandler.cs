using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.ListAcademicSurveys
{
    public class ListAcademicSurveysQueryHandler(IAcademicSurveyRepository repository, IMapper mapper)
        : IRequestHandler<ListAcademicSurveysQuery, IReadOnlyList<AcademicSurveySummaryDto>>
    {
        public async Task<IReadOnlyList<AcademicSurveySummaryDto>> Handle(ListAcademicSurveysQuery request, CancellationToken cancellationToken)
        {
            var list = await repository.ListAsync(request.Status, request.TechnicalCareerId, request.SubjectId, request.Search, cancellationToken);
            return mapper.Map<List<AcademicSurveySummaryDto>>(list);
        }
    }
}
