using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Competencies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competencies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Competencies_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Competencies_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CompetencyEvaluationInstances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PeriodFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PeriodTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Semester = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompetencyEvaluationInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompetencyEvaluationInstances_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CompetencyEvaluationInstances_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Professors",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professors", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Professors_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnicalCareers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnicalCareers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnicalCareers_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TechnicalCareers_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CompetencyLevelDescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompetencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompetencyLevelDescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompetencyLevelDescriptions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CompetencyLevelDescriptions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CompetencyLevelDescriptions_Competencies_CompetencyId",
                        column: x => x.CompetencyId,
                        principalTable: "Competencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CompetencyId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormQuestions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormQuestions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormQuestions_Competencies_CompetencyId",
                        column: x => x.CompetencyId,
                        principalTable: "Competencies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CompetencyEvaluationInstanceTechnicalCareer",
                columns: table => new
                {
                    CompetencyEvaluationInstancesId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnicalCareersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompetencyEvaluationInstanceTechnicalCareer", x => new { x.CompetencyEvaluationInstancesId, x.TechnicalCareersId });
                    table.ForeignKey(
                        name: "FK_CompetencyEvaluationInstanceTechnicalCareer_CompetencyEvalu~",
                        column: x => x.CompetencyEvaluationInstancesId,
                        principalTable: "CompetencyEvaluationInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompetencyEvaluationInstanceTechnicalCareer_TechnicalCareer~",
                        column: x => x.TechnicalCareersId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Coordinators",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    TechnicalCareerId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coordinators", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Coordinators_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Coordinators_TechnicalCareers_TechnicalCareerId",
                        column: x => x.TechnicalCareerId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    TechnicalCareerId = table.Column<Guid>(type: "uuid", nullable: true),
                    CurrentYear = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Students_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Students_TechnicalCareers_TechnicalCareerId",
                        column: x => x.TechnicalCareerId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    TechnicalCareerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    ProfessorId = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subjects_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Subjects_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Subjects_Professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professors",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Subjects_TechnicalCareers_TechnicalCareerId",
                        column: x => x.TechnicalCareerId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "QuestionResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FormQuestionId = table.Column<Guid>(type: "uuid", nullable: true),
                    StudentCompetencyEvaluationId = table.Column<Guid>(type: "uuid", nullable: true),
                    ResponseValue = table.Column<int>(type: "integer", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionResponses_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuestionResponses_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuestionResponses_FormQuestions_FormQuestionId",
                        column: x => x.FormQuestionId,
                        principalTable: "FormQuestions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StudentEvaluationReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: false),
                    CompetencyEvaluationInstanceId = table.Column<Guid>(type: "uuid", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GeneratedByUserId = table.Column<string>(type: "text", nullable: true),
                    Observation = table.Column<string>(type: "text", nullable: true),
                    BlobName = table.Column<string>(type: "text", nullable: true),
                    ContainerName = table.Column<string>(type: "text", nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: true),
                    ContentType = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentEvaluationReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentEvaluationReports_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentEvaluationReports_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentEvaluationReports_CompetencyEvaluationInstances_Comp~",
                        column: x => x.CompetencyEvaluationInstanceId,
                        principalTable: "CompetencyEvaluationInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentEvaluationReports_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfessorCompetencyAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompetencyEvaluationInstanceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CompetencyId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ProfessorUserId = table.Column<string>(type: "text", nullable: true),
                    TechnicalCareerId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorCompetencyAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_Competencies_CompetencyId",
                        column: x => x.CompetencyId,
                        principalTable: "Competencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_CompetencyEvaluationInstance~",
                        column: x => x.CompetencyEvaluationInstanceId,
                        principalTable: "CompetencyEvaluationInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_Professors_ProfessorUserId",
                        column: x => x.ProfessorUserId,
                        principalTable: "Professors",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfessorCompetencyAssignments_TechnicalCareers_TechnicalCa~",
                        column: x => x.TechnicalCareerId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StudentSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSubjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentSubjects_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentSubjects_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentSubjects_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentSubjects_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentCompetencyAssessments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: true),
                    ProfessorCompetencyAssignmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: true),
                    CompetencyLevel = table.Column<int>(type: "integer", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentCompetencyAssessments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentCompetencyAssessments_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentCompetencyAssessments_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentCompetencyAssessments_ProfessorCompetencyAssignments~",
                        column: x => x.ProfessorCompetencyAssignmentId,
                        principalTable: "ProfessorCompetencyAssignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentCompetencyAssessments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentCompetencyAssessments_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Competencies_CreatedByUserId",
                table: "Competencies",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Competencies_UpdatedByUserId",
                table: "Competencies",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyEvaluationInstances_CreatedByUserId",
                table: "CompetencyEvaluationInstances",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyEvaluationInstances_UpdatedByUserId",
                table: "CompetencyEvaluationInstances",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyEvaluationInstanceTechnicalCareer_TechnicalCareer~",
                table: "CompetencyEvaluationInstanceTechnicalCareer",
                column: "TechnicalCareersId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyLevelDescriptions_CompetencyId_Level",
                table: "CompetencyLevelDescriptions",
                columns: new[] { "CompetencyId", "Level" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyLevelDescriptions_CreatedByUserId",
                table: "CompetencyLevelDescriptions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompetencyLevelDescriptions_UpdatedByUserId",
                table: "CompetencyLevelDescriptions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Coordinators_TechnicalCareerId",
                table: "Coordinators",
                column: "TechnicalCareerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestions_CompetencyId",
                table: "FormQuestions",
                column: "CompetencyId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestions_CreatedByUserId",
                table: "FormQuestions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestions_UpdatedByUserId",
                table: "FormQuestions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_CompetencyEvaluationInstance~",
                table: "ProfessorCompetencyAssignments",
                column: "CompetencyEvaluationInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_CompetencyId",
                table: "ProfessorCompetencyAssignments",
                column: "CompetencyId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_CreatedByUserId",
                table: "ProfessorCompetencyAssignments",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_ProfessorUserId",
                table: "ProfessorCompetencyAssignments",
                column: "ProfessorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_SubjectId",
                table: "ProfessorCompetencyAssignments",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_TechnicalCareerId",
                table: "ProfessorCompetencyAssignments",
                column: "TechnicalCareerId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorCompetencyAssignments_UpdatedByUserId",
                table: "ProfessorCompetencyAssignments",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionResponses_CreatedByUserId",
                table: "QuestionResponses",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionResponses_FormQuestionId",
                table: "QuestionResponses",
                column: "FormQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionResponses_UpdatedByUserId",
                table: "QuestionResponses",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCompetencyAssessments_CreatedByUserId",
                table: "StudentCompetencyAssessments",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCompetencyAssessments_ProfessorCompetencyAssignmentId",
                table: "StudentCompetencyAssessments",
                column: "ProfessorCompetencyAssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCompetencyAssessments_StudentId",
                table: "StudentCompetencyAssessments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCompetencyAssessments_SubjectId",
                table: "StudentCompetencyAssessments",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCompetencyAssessments_UpdatedByUserId",
                table: "StudentCompetencyAssessments",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentEvaluationReports_CompetencyEvaluationInstanceId",
                table: "StudentEvaluationReports",
                column: "CompetencyEvaluationInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentEvaluationReports_CreatedByUserId",
                table: "StudentEvaluationReports",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentEvaluationReports_StudentId",
                table: "StudentEvaluationReports",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentEvaluationReports_UpdatedByUserId",
                table: "StudentEvaluationReports",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_TechnicalCareerId",
                table: "Students",
                column: "TechnicalCareerId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_CreatedByUserId",
                table: "StudentSubjects",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_StudentId_SubjectId",
                table: "StudentSubjects",
                columns: new[] { "StudentId", "SubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_SubjectId",
                table: "StudentSubjects",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_UpdatedByUserId",
                table: "StudentSubjects",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_CreatedByUserId",
                table: "Subjects",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_ProfessorId",
                table: "Subjects",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_TechnicalCareerId",
                table: "Subjects",
                column: "TechnicalCareerId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_UpdatedByUserId",
                table: "Subjects",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalCareers_CreatedByUserId",
                table: "TechnicalCareers",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnicalCareers_UpdatedByUserId",
                table: "TechnicalCareers",
                column: "UpdatedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CompetencyEvaluationInstanceTechnicalCareer");

            migrationBuilder.DropTable(
                name: "CompetencyLevelDescriptions");

            migrationBuilder.DropTable(
                name: "Coordinators");

            migrationBuilder.DropTable(
                name: "QuestionResponses");

            migrationBuilder.DropTable(
                name: "StudentCompetencyAssessments");

            migrationBuilder.DropTable(
                name: "StudentEvaluationReports");

            migrationBuilder.DropTable(
                name: "StudentSubjects");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "FormQuestions");

            migrationBuilder.DropTable(
                name: "ProfessorCompetencyAssignments");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Competencies");

            migrationBuilder.DropTable(
                name: "CompetencyEvaluationInstances");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Professors");

            migrationBuilder.DropTable(
                name: "TechnicalCareers");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
