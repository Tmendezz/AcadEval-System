using AcadEvalSys.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Student> Students { get; set; }
    public DbSet<Professor> Professors { get; set; }
    public DbSet<Coordinator> Coordinators { get; set; }
    public DbSet<TechnicalCareer> TechnicalCareers { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Competency> Competencies { get; set; }
    public DbSet<CompetencyLevelDescription> CompetencyLevelDescriptions { get; set; }
    public DbSet<StudentSubject> StudentSubjects { get; set; }
    public DbSet<StudentEvaluationReport> StudentEvaluationReports { get; set; }

    public DbSet<CompetencyEvaluationInstance> CompetencyEvaluationInstances { get; set; }
    public DbSet<ProfessorCompetencyAssignment> ProfessorCompetencyAssignments { get; set; }
    public DbSet<StudentCompetencyAssessment> StudentCompetencyAssessments { get; set; }

    public DbSet<AcademicSurvey> AcademicSurveys { get; set; }
    public DbSet<SurveyTemplate> SurveyTemplates { get; set; }
    public DbSet<SurveyTemplateQuestion> SurveyTemplateQuestions { get; set; }
    public DbSet<SurveyTemplateQuestionOption> SurveyTemplateQuestionOptions { get; set; }

    public DbSet<SurveyQuestion> SurveyQuestions { get; set; }
    public DbSet<SurveyQuestionOption> SurveyQuestionOptions { get; set; }
    public DbSet<AcademicSurveySubject> AcademicSurveySubjects { get; set; }
    public DbSet<AcademicSurveyResponse> AcademicSurveyResponses { get; set; }
    public DbSet<SurveyQuestionResponse> SurveyQuestionResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Student>(entity =>
        {
            entity.HasKey(s => s.UserId);

            entity.HasOne(s => s.User)
                  .WithOne(u => u.Student)
                  .HasForeignKey<Student>(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Professor>(entity =>
        {
            entity.HasKey(p => p.UserId);

            entity.HasOne(p => p.User)
                  .WithOne(u => u.Professor)
                  .HasForeignKey<Professor>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Coordinator>(entity =>
        {
            entity.HasKey(c => c.UserId);

            entity.HasOne(c => c.User)
                  .WithOne(u => u.Coordinator)
                  .HasForeignKey<Coordinator>(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

        // Asegurar 1 coordinador por carrera (índice único)
        entity.HasIndex(c => c.TechnicalCareerId)
            .IsUnique();
        });

        builder.Entity<StudentCompetencyAssessment>(entity =>
        {
            entity.HasOne(e => e.Student)
                .WithMany(s => s.StudentCompetencyAssessments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ProfessorCompetencyAssignment)
                .WithMany(p => p.StudentCompetencyAssessments)
                .HasForeignKey(e => e.ProfessorCompetencyAssignmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ProfessorCompetencyAssignment>(entity =>
        {
            entity.HasOne(pca => pca.Subject)
                .WithMany(s => s.ProfessorCompetencyAssignments)
                .HasForeignKey(pca => pca.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<CompetencyLevelDescription>(entity =>
        {
            entity.HasOne(cld => cld.Competency)
                .WithMany(c => c.LevelDescriptions)
                .HasForeignKey(cld => cld.CompetencyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(cld => new { cld.CompetencyId, cld.Level })
                .IsUnique();
        });

        builder.Entity<CompetencyEvaluationInstance>()
            .HasMany(e => e.TechnicalCareers)
            .WithMany(t => t.CompetencyEvaluationInstances);

        // Configuración explícita para StudentSubject
        builder.Entity<StudentSubject>(entity =>
        {
            entity.HasKey(ss => ss.Id);

            entity.HasOne(ss => ss.Student)
                .WithMany(s => s.StudentSubjects)
                .HasForeignKey(ss => ss.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ss => ss.Subject)
                .WithMany(s => s.StudentSubjects)
                .HasForeignKey(ss => ss.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Índice único para evitar duplicados
            entity.HasIndex(ss => new { ss.StudentId, ss.SubjectId })
                .IsUnique();
        });

        builder.Entity<AcademicSurvey>(entity =>
        {
            entity.Property(a => a.Title).IsRequired().HasMaxLength(200);
            entity.Property(a => a.Status).HasConversion<int>();

            entity.HasOne(a => a.Template)
                .WithMany()
                .HasForeignKey(a => a.TemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(a => a.Subjects)
                .WithOne(ass => ass.AcademicSurvey!)
                .HasForeignKey(ass => ass.AcademicSurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(a => a.Questions)
                .WithOne(q => q.AcademicSurvey!)
                .HasForeignKey(q => q.AcademicSurveyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<SurveyTemplate>(entity =>
        {
            entity.Property(st => st.Name).IsRequired().HasMaxLength(200);

            entity.HasMany(st => st.Questions)
                .WithOne()
                .HasForeignKey(q => q.TemplateId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<SurveyTemplateQuestion>(entity =>
        {
            entity.Property(q => q.Text).IsRequired().HasMaxLength(1000);
            entity.Property(q => q.Type).HasConversion<int>();

            entity.HasMany(q => q.Options)
                .WithOne()
                .HasForeignKey(o => o.TemplateQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(q => new { q.TemplateId, q.Order });
        });

        builder.Entity<SurveyTemplateQuestionOption>(entity =>
        {
            entity.Property(o => o.Text).IsRequired().HasMaxLength(300);
            entity.HasIndex(o => new { o.TemplateQuestionId, o.Value }).IsUnique();
        });

        builder.Entity<SurveyQuestion>(entity =>
        {
            entity.Property(fq => fq.Text).HasMaxLength(1000);
            entity.Property(fq => fq.Type).HasConversion<int>();

            entity.HasMany<SurveyQuestionResponse>()
                .WithOne(sqr => sqr.SurveyQuestion)
                .HasForeignKey(sqr => sqr.SurveyQuestionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<SurveyQuestionOption>(entity =>
        {
            entity.Property(o => o.Text).IsRequired().HasMaxLength(300);
            entity.HasIndex(o => new { o.SurveyQuestionId, o.Value }).IsUnique();
        });

        builder.Entity<AcademicSurveySubject>(entity =>
        {
            entity.Property(ass => ass.AcademicSurveyId).IsRequired();

            // Enum nullable
            entity.Property(ass => ass.Year).HasConversion<int?>();

            // Relación opcional con TechnicalCareer
            entity.HasOne<TechnicalCareer>()
                .WithMany()
                .HasForeignKey(ass => ass.TechnicalCareerId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relación opcional con Subject
            entity.HasOne(ass => ass.Subject)
                .WithMany()
                .HasForeignKey(ass => ass.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relación opcional con Professor (clave = UserId)
            entity.HasOne<Professor>()
                .WithMany()
                .HasForeignKey(ass => ass.ProfessorUserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(ass => ass.Responses)
                .WithOne()
                .HasForeignKey(asr => asr.AcademicSurveySubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<AcademicSurveyResponse>(entity =>
        {
            entity.Property(r => r.UserId).IsRequired();
            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<AcademicSurveySubject>()
                .WithMany(s => s.Responses)
                .HasForeignKey(r => r.AcademicSurveySubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<SurveyQuestionResponse>(entity =>
        {
            entity.HasOne<AcademicSurveyResponse>()
                .WithMany(r => r.QuestionResponses)
                .HasForeignKey(qr => qr.AcademicSurveyResponseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(qr => qr.SurveyQuestion)
                .WithMany()
                .HasForeignKey(qr => qr.SurveyQuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(qr => new { qr.AcademicSurveyResponseId, qr.SurveyQuestionId }).IsUnique();
        });
    }
}