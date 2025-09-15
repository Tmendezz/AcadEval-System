namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveySubjectResponsesDto
    {
        public Guid SurveySubjectId { get; set; }
        public Guid SurveyId { get; set; }
        public string? SubjectName { get; set; }
        public int ResponsesCount { get; set; }
        public IList<SurveyUserResponseDto> Responses { get; set; } = new List<SurveyUserResponseDto>();
    }
}
