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
    public DbSet<FormQuestion> FormQuestions { get; set; }
    public DbSet<QuestionResponse> QuestionResponses { get; set; }
    public DbSet<ProfessorCompetencyAssignment> ProfessorCompetencyAssignments { get; set; }
    public DbSet<StudentCompetencyAssessment> StudentCompetencyAssessments { get; set; }


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

    }
}