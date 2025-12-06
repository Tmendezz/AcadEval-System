using AcadEvalSys.Application.Evaluations.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetCareerYearAssignmentDetails;

public class GetCareerYearAssignmentDetailsQueryHandler 
    : IRequestHandler<GetCareerYearAssignmentDetailsQuery, List<CareerYearAssignmentDetailDto>>
{
    private readonly ICompetencyEvaluationInstanceRepository _evaluationRepository;
    private readonly IProfessorCompetencyAssignmentRepository _assignmentRepository;
    private readonly IMapper _mapper;

    public GetCareerYearAssignmentDetailsQueryHandler(
        ICompetencyEvaluationInstanceRepository evaluationRepository,
        IProfessorCompetencyAssignmentRepository assignmentRepository,
        IMapper mapper)
    {
        _evaluationRepository = evaluationRepository;
        _assignmentRepository = assignmentRepository;
        _mapper = mapper;
    }

    public async Task<List<CareerYearAssignmentDetailDto>> Handle(
        GetCareerYearAssignmentDetailsQuery request, 
        CancellationToken cancellationToken)
    {
        // Verificar que la evaluación existe
        var evaluation = await _evaluationRepository.GetByIdAsync(request.EvaluationId);
        if (evaluation == null)
        {
            throw new NotFoundException(nameof(CompetencyEvaluationInstance), evaluation.Id.ToString());
        }

        // Parsear el año
        if (!Enum.TryParse<CareerYear>(request.Year, out var careerYear))
        {
            throw new ArgumentException($"Invalid year value: {request.Year}");
        }

        // Obtener las asignaciones de la carrera y año específicos con datos de estudiantes
        var assignments = await _assignmentRepository.GetCareerYearAssignmentDetailsAsync(
            request.EvaluationId,
            request.CareerId,
            careerYear,
            cancellationToken);

        // Mapear a DTOs calculando los conteos desde las relaciones
        var result = assignments.Select(assignment => 
        {
            var totalStudents = assignment.StudentCompetencyAssessments?.Count() ?? 0;
            var evaluatedStudents = assignment.StudentCompetencyAssessments?
                .Count(sca => sca.Status == AssessmentStatus.Completed) ?? 0;
            
            return new CareerYearAssignmentDetailDto
            {
                AssignmentId = assignment.Id,
                CompetencyName = assignment.Competency?.Name ?? string.Empty,
                SubjectName = assignment.Subject?.Name ?? string.Empty,
                ProfessorName = assignment.Subject?.Professor?.User?.Name ?? string.Empty,
                Status = assignment.Status.ToString(),
                TotalStudentsCount = totalStudents,
                EvaluatedStudentsCount = evaluatedStudents,
                ProgressPercentage = totalStudents > 0 
                    ? Math.Round((decimal)evaluatedStudents / totalStudents * 100, 2)
                    : 0
            };
        }).ToList();

        return result;
    }
}