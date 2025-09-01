using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace AcadEvalSys.Infrastructure.Seeders;

internal class DbSeeder(ApplicationDbContext dbContext, UserManager<User> userManager) : IDbSeeder
{
    public async Task Seed()
    {
        if (dbContext.Database.GetPendingMigrations().Any())
        {
            await dbContext.Database.MigrateAsync();
        }

        if (await dbContext.Database.CanConnectAsync())
        {
            if (!dbContext.Roles.Any())
            {
                var roles = GetRoles();
                dbContext.Roles.AddRange(roles);
                await dbContext.SaveChangesAsync();
            }

            var adminId = await EnsureAdminUser();
            var professorId = await EnsureProfessorUser();
            var studentId = await EnsureStudentUser();

            if (!dbContext.TechnicalCareers.Any())
            {
                var careers = GetCareers();
                dbContext.TechnicalCareers.AddRange(careers);
                await dbContext.SaveChangesAsync();
            }

            // Crear entidad Professor ANTES de crear las materias
            if (!dbContext.Professors.Any())
            {
                var professor = new Professor
                {
                    UserId = professorId,
                    Phone = "+34 612 345 678"
                };
                dbContext.Professors.Add(professor);
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Students.Any())
            {
                var student = new Student
                {
                    UserId = studentId,
                    TechnicalCareerId = dbContext.TechnicalCareers.First().Id,
                    CurrentYear = CareerYear.Second
                };
                dbContext.Students.Add(student);
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Competencies.Any())
            {
                var competencies = GetCompetencies();
                dbContext.Competencies.AddRange(competencies);
                await dbContext.SaveChangesAsync();

                var insertedCompetencies = await dbContext.Competencies.ToListAsync();

                var descriptions = GetCompetencyLevelDescriptions(insertedCompetencies);
                dbContext.CompetencyLevelDescriptions.AddRange(descriptions);
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.Subjects.Any())
            {
                var subjects = GetSubjects(dbContext.TechnicalCareers.First().Id.ToString(), professorId);
                dbContext.Subjects.AddRange(subjects);
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.StudentSubjects.Any())
            {
                var studentSubject = new StudentSubject
                {
                    StudentId = studentId,
                    SubjectId = dbContext.Subjects.First().Id,
                    CreatedByUserId = adminId
                };
                dbContext.StudentSubjects.Add(studentSubject);
                await dbContext.SaveChangesAsync();
            }

            if (!dbContext.CompetencyEvaluationInstances.Any())
            {
                // Crear múltiples evaluaciones con fechas diferentes para probar el ordenamiento
                var evaluationInstances = new List<CompetencyEvaluationInstance>
                {
                    new CompetencyEvaluationInstance
                    {
                        Title = "Evaluación de Competencias - Test Finalize",
                        Description = "Instancia de evaluación para testear la funcionalidad de finalización y generación de reportes",
                        PeriodFrom = DateTime.UtcNow.AddDays(-7),
                        PeriodTo = DateTime.UtcNow.AddDays(7),
                        Status = EvaluationStatus.Pending,
                        CreatedAt = DateTime.UtcNow.AddDays(-30), // Evaluación más antigua
                        CreatedByUserId = adminId
                    },
                    new CompetencyEvaluationInstance
                    {
                        Title = "Evaluación de Competencias - Semestre Actual",
                        Description = "Evaluación del semestre actual para todas las carreras",
                        PeriodFrom = DateTime.UtcNow.AddDays(-15),
                        PeriodTo = DateTime.UtcNow.AddDays(15),
                        Status = EvaluationStatus.Pending,
                        CreatedAt = DateTime.UtcNow.AddDays(-15), // Evaluación intermedia
                        CreatedByUserId = adminId
                    },
                    new CompetencyEvaluationInstance
                    {
                        Title = "Evaluación de Competencias - Próximo Semestre",
                        Description = "Evaluación planificada para el próximo semestre",
                        PeriodFrom = DateTime.UtcNow.AddDays(30),
                        PeriodTo = DateTime.UtcNow.AddDays(60),
                        Status = EvaluationStatus.Pending,
                        CreatedAt = DateTime.UtcNow.AddDays(-5), // Evaluación más reciente
                        CreatedByUserId = adminId
                    }
                };

                dbContext.CompetencyEvaluationInstances.AddRange(evaluationInstances);
                await dbContext.SaveChangesAsync();

                // Usar la primera evaluación para crear las asignaciones
                var evaluationInstance = evaluationInstances.First();

                var professorAssignments = CreateProfessorCompetencyAssignments(
                    evaluationInstance.Id,
                    dbContext.Competencies.ToList(),
                    dbContext.Subjects.First().Id,
                    adminId);
             
                
                dbContext.ProfessorCompetencyAssignments.AddRange(professorAssignments);
                await dbContext.SaveChangesAsync();
                

                var studentAssessments = CreateStudentCompetencyAssessments(
                    professorAssignments,
                    studentId,
                    adminId);

                Console.WriteLine($"Creating {studentAssessments.Count()} student assessments");
                Console.WriteLine($"Student ID: {studentId}");
                
                dbContext.StudentCompetencyAssessments.AddRange(studentAssessments);
                await dbContext.SaveChangesAsync();
                
                Console.WriteLine($"Created {studentAssessments.Count()} student assessments successfully");
            }
        }
    }

    private async Task<string> EnsureAdminUser()
    {
        const string adminEmail = "admin@itec.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                Name = "Administrador del Sistema"
            };

            var result = await userManager.CreateAsync(adminUser, "Administrator1390_");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
            }
        }

        return adminUser.Id;
    }

    private async Task<string> EnsureProfessorUser()
    {
        const string professorEmail = "profesor@itec.com";
        var professorUser = await userManager.FindByEmailAsync(professorEmail);

        if (professorUser == null)
        {
            professorUser = new User
            {
                UserName = professorEmail,
                Email = professorEmail,
                EmailConfirmed = true,
                Name = "María González Rodríguez"
            };

            var result = await userManager.CreateAsync(professorUser, "Professor1390_");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(professorUser, UserRoles.Professor);
            }
        }

        return professorUser.Id;
    }

    private async Task<string> EnsureStudentUser()
    {
        const string studentEmail = "estudiante@itec.com";
        var studentUser = await userManager.FindByEmailAsync(studentEmail);

        if (studentUser == null)
        {
            studentUser = new User
            {
                UserName = studentEmail,
                Email = studentEmail,
                EmailConfirmed = true,
                Name = "Juan Carlos Pérez López"
            };

            var result = await userManager.CreateAsync(studentUser, "Student1390_");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(studentUser, UserRoles.Student);
            }
        }

        return studentUser.Id;
    }

    private IEnumerable<IdentityRole> GetRoles()
    {
        List<IdentityRole> roles =
        [
            new(UserRoles.Admin) { NormalizedName = UserRoles.Admin.ToUpper() },
            new(UserRoles.Student) { NormalizedName = UserRoles.Student.ToUpper() },
            new(UserRoles.Professor) { NormalizedName = UserRoles.Professor.ToUpper() },
            new(UserRoles.Coordinator) { NormalizedName = UserRoles.Coordinator.ToUpper() }
        ];

        return roles;
    }

    private IEnumerable<TechnicalCareer> GetCareers()
    {
        List<TechnicalCareer> careers =
        [
            new() { Name = "Desarrollo de Software"},
            new() { Name = "Logística"},
            new() { Name = "Mantenimiento Industrial"},
            new() { Name = "Gestión Industrial"},
            new() { Name = "Seguridad, Higiene y Medio Ambiente"},
            new() { Name = "Gestión de Energías Renovables"},
        ];

        return careers;
    }


    private IEnumerable<Subject> GetSubjects(string technicalCareerId, string professorId)
    {
        List<Subject> subjects = new()
        {
            new() { Name = "Programación II", TechnicalCareerId = Guid.Parse(technicalCareerId), Year = CareerYear.Second, ProfessorId = professorId },
            new() { Name = "Estructura de Datos", TechnicalCareerId = Guid.Parse(technicalCareerId), Year = CareerYear.Second, ProfessorId = professorId },
        };

        return subjects;
    }

    private IEnumerable<Competency> GetCompetencies()
    {
        List<Competency> competencies = new()
        {
            new()
            {
                Name = "Liderazgo",
                Description = "Capacidad de liderar equipos, motivar y guiar con visión.",
                Type = CompetencyType.Soft
            },
            new()
            {
                Name = "Comunicación Efectiva",
                Description = "Habilidad para transmitir ideas de manera clara y persuasiva, adaptándose al contexto.",
                Type = CompetencyType.Soft
            },
            new()
            {
                Name = "Gestión Emocional",
                Description = "Capacidad de manejar las propias emociones y comprender las de los demás en entornos laborales.",
                Type =CompetencyType.Soft
            },
            new()
            {
                Name = "Proactividad",
                Description = "Iniciativa para anticiparse a problemas y proponer mejoras.",
                Type =CompetencyType.Soft
            },
            new()
            {
                Name = "Trabajo en Equipo",
                Description = "Habilidad para colaborar eficazmente, gestionar conflictos y potenciar la sinergia grupal.",
                Type =CompetencyType.Soft
            }
        };
        return competencies;
    }

    private IEnumerable<CompetencyLevelDescription> GetCompetencyLevelDescriptions(IEnumerable<Competency> competencies)
    {
        var descriptions = new List<CompetencyLevelDescription>();

        foreach (var competency in competencies)
        {
            descriptions.Add(new CompetencyLevelDescription
            {
                CompetencyId = competency.Id,
                Level = CompetencyLevel.Inicial,
                Description = GetLevel1Description(competency.Name),
                CreatedByUserId = competency.CreatedByUserId
            });

            descriptions.Add(new CompetencyLevelDescription
            {
                CompetencyId = competency.Id,
                Level = CompetencyLevel.Intermedio,
                Description = GetLevel2Description(competency.Name),
                CreatedByUserId = competency.CreatedByUserId
            });

            descriptions.Add(new CompetencyLevelDescription
            {
                CompetencyId = competency.Id,
                Level = CompetencyLevel.Avanzado,
                Description = GetLevel3Description(competency.Name),
                CreatedByUserId = competency.CreatedByUserId
            });

            descriptions.Add(new CompetencyLevelDescription
            {
                CompetencyId = competency.Id,
                Level = CompetencyLevel.Excelente,
                Description = GetLevel4Description(competency.Name),
                CreatedByUserId = competency.CreatedByUserId
            });
        }

        return descriptions;
    }


    private string GetLevel1Description(string competencyName)
    {
        return competencyName switch
        {
            "Liderazgo" => "Participa solo cuando se le indica y evita tomar decisiones.",
            "Comunicación Efectiva" => "Se expresa con dificultad y su mensaje suele ser confuso o incompleto.",
            "Gestión Emocional" => "Reacciona impulsivamente y evita enfrentar situaciones difíciles.",
            "Proactividad" => "Espera instrucciones para actuar y no anticipa problemas.",
            "Trabajo en Equipo" => "Cumple su parte sin integrarse ni coordinar con el grupo.",
            _ => "Descripción no definida."
        };
    }

    private string GetLevel2Description(string competencyName)
    {
        return competencyName switch
        {
            "Liderazgo" => "Asume tareas de coordinación en situaciones simples y motiva ocasionalmente.",
            "Comunicación Efectiva" => "Comunica con mayor claridad y adapta su mensaje según el contexto.",
            "Gestión Emocional" => "Controla sus emociones en situaciones tensas y expresa sus ideas con mayor claridad.",
            "Proactividad" => "Toma iniciativa en tareas conocidas y propone mejoras puntuales.",
            "Trabajo en Equipo" => "Colabora activamente, escucha y negocia en situaciones de desacuerdo.",
            _ => "Descripción no definida."
        };
    }

    private string GetLevel3Description(string competencyName)
    {
        return competencyName switch
        {
            "Liderazgo" => "Lidera con planificación, distribuye tareas y resuelve conflictos con eficacia.",
            "Comunicación Efectiva" => "Se comunica con seguridad, escucha activamente y persuade con argumentos sólidos.",
            "Gestión Emocional" => "Mantiene la calma, regula el clima grupal y actúa con empatía ante el conflicto.",
            "Proactividad" => "Actúa con autonomía, detecta oportunidades y propone soluciones innovadoras.",
            "Trabajo en Equipo" => "Promueve la participación equitativa, gestiona conflictos y fortalece la cohesión.",
            _ => "Descripción no definida."
        };
    }

    private string GetLevel4Description(string competencyName)
    {
        return competencyName switch
        {
            "Liderazgo" => "Lidera con visión, empodera al equipo y transforma dinámicas grupales.",
            "Comunicación Efectiva" => "Domina distintos registros comunicativos, influye estratégicamente y gestiona conversaciones complejas.",
            "Gestión Emocional" => "Lidera con inteligencia emocional, anticipa tensiones y promueve el bienestar colectivo.",
            "Proactividad" => "Lidera mejoras continuas, anticipa desafíos y moviliza al grupo hacia la acción.",
            "Trabajo en Equipo" => "Fomenta equipos de alto rendimiento, media con eficacia y potencia la sinergia grupal.",
            _ => "Descripción no definida."
        };
    }

    private IEnumerable<ProfessorCompetencyAssignment> CreateProfessorCompetencyAssignments(
        Guid evaluationInstanceId,
        IEnumerable<Competency> competencies,
        Guid subjectId,
        string createdByUserId)
    {
        var assignments = new List<ProfessorCompetencyAssignment>();

        Console.WriteLine($"CreateProfessorCompetencyAssignments: evaluationInstanceId={evaluationInstanceId}, subjectId={subjectId}, createdByUserId={createdByUserId}");
        Console.WriteLine($"Competencies count: {competencies.Count()}");

        foreach (var competency in competencies)
        {
            var assignment = new ProfessorCompetencyAssignment
            {
                CompetencyEvaluationInstanceId = evaluationInstanceId,
                CompetencyId = competency.Id,
                SubjectId = subjectId,
                Status = ProfessorAssignmentStatus.Pending, // Activo para que se pueda evaluar
                CreatedByUserId = createdByUserId
            };
            
            assignments.Add(assignment);
            Console.WriteLine($"Created assignment for competency: {competency.Name} (ID: {competency.Id})");
        }

        Console.WriteLine($"Total assignments created: {assignments.Count}");
        return assignments;
    }

    private IEnumerable<StudentCompetencyAssessment> CreateStudentCompetencyAssessments(
        IEnumerable<ProfessorCompetencyAssignment> professorAssignments,
        string studentId,
        string createdByUserId)
    {
        var assessments = new List<StudentCompetencyAssessment>();
        var competencyLevels = new[]
        {
            CompetencyLevel.Avanzado,    // Liderazgo
            CompetencyLevel.Excelente,   // Comunicación Efectiva  
            CompetencyLevel.Intermedio,  // Gestión Emocional
            CompetencyLevel.Avanzado,    // Proactividad
            CompetencyLevel.Excelente    // Trabajo en Equipo
        };

        Console.WriteLine($"CreateStudentCompetencyAssessments: studentId={studentId}, createdByUserId={createdByUserId}");
        Console.WriteLine($"Professor assignments count: {professorAssignments.Count()}");

        int levelIndex = 0;
        foreach (var assignment in professorAssignments)
        {
            var assessment = new StudentCompetencyAssessment
            {
                ProfessorCompetencyAssignmentId = assignment.Id,
                StudentId = studentId,
                CompetencyLevel = competencyLevels[levelIndex % competencyLevels.Length],
                Status = AssessmentStatus.Completed, // YA COMPLETADO para poder finalizar
                CompletedAt = DateTime.UtcNow.AddHours(-1), // Completado hace 1 hora
                CreatedByUserId = createdByUserId,
                UpdatedAt = DateTime.UtcNow.AddHours(-1)
            };
            
            assessments.Add(assessment);
            Console.WriteLine($"Created assessment for assignment {assignment.Id} with level {competencyLevels[levelIndex % competencyLevels.Length]}");
            levelIndex++;
        }

        Console.WriteLine($"Total assessments created: {assessments.Count}");
        return assessments;
    }
}