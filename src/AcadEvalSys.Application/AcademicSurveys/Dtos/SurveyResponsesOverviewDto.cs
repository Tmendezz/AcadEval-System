namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveyResponsesOverviewDto
    {
        public Guid SurveyId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int SubjectsCount { get; set; }
        public int TotalResponses { get; set; }
        public IList<SurveyUserResponseDto> Responses { get; set; } = new List<SurveyUserResponseDto>();
    }
}
