using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.DeleteAcademicSurvey;

public class DeleteAcademicSurveyCommand : IRequest
{
    public Guid Id { get; set; }
}