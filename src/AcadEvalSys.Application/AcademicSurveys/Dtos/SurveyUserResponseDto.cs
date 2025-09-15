namespace AcadEvalSys.Application.AcademicSurveys.Dtos
{
    public class SurveyUserResponseDto
    {
        public Guid ResponseId { get; set; }
        public Guid SurveySubjectId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public IList<SubmitSurveyAnswerDto> Answers { get; set; } = new List<SubmitSurveyAnswerDto>();
    }
}
