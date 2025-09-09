using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSurveyModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionResponses");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "FormQuestions");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "FormQuestions",
                newName: "QuestionType");

            migrationBuilder.AlterColumn<int>(
                name: "CompetencyLevel",
                table: "StudentCompetencyAssessments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "FormQuestions",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Orden",
                table: "FormQuestions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AcademicSurveys",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PublishAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CloseAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademicSurveys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AcademicSurveys_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AcademicSurveys_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FormQuestionOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FormQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormQuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormQuestionOptions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormQuestionOptions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SurveyTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyTemplates_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyTemplates_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AcademicSurveySubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicSurveyId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnicalCareerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Year = table.Column<int>(type: "integer", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProfessorUserId = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademicSurveySubjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_AcademicSurveys_AcademicSurveyId",
                        column: x => x.AcademicSurveyId,
                        principalTable: "AcademicSurveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_Professors_ProfessorUserId",
                        column: x => x.ProfessorUserId,
                        principalTable: "Professors",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AcademicSurveySubjects_TechnicalCareers_TechnicalCareerId",
                        column: x => x.TechnicalCareerId,
                        principalTable: "TechnicalCareers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SurveyTemplateQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: true),
                    isRequired = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyTemplateQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestions_SurveyTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "SurveyTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AcademicSurveyResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicSurveySubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademicSurveyResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AcademicSurveyResponses_AcademicSurveySubjects_AcademicSurv~",
                        column: x => x.AcademicSurveySubjectId,
                        principalTable: "AcademicSurveySubjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AcademicSurveyResponses_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AcademicSurveyResponses_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AcademicSurveyResponses_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyTemplateQuestionOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TemplateQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyTemplateQuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestionOptions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestionOptions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyTemplateQuestionOptions_SurveyTemplateQuestions_Templ~",
                        column: x => x.TemplateQuestionId,
                        principalTable: "SurveyTemplateQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyQuestionResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicSurveyResponseId = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicSurveySubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    FormQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    SelectedValue = table.Column<int>(type: "integer", nullable: true),
                    Text = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyQuestionResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyQuestionResponses_AcademicSurveyResponses_AcademicSur~",
                        column: x => x.AcademicSurveyResponseId,
                        principalTable: "AcademicSurveyResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyQuestionResponses_AcademicSurveySubjects_AcademicSurv~",
                        column: x => x.AcademicSurveySubjectId,
                        principalTable: "AcademicSurveySubjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyQuestionResponses_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestionResponses_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestionResponses_FormQuestions_FormQuestionId",
                        column: x => x.FormQuestionId,
                        principalTable: "FormQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_AcademicSurveySubjectId",
                table: "AcademicSurveyResponses",
                column: "AcademicSurveySubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_CreatedByUserId",
                table: "AcademicSurveyResponses",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UpdatedByUserId",
                table: "AcademicSurveyResponses",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UserId_AcademicSurveySubjectId",
                table: "AcademicSurveyResponses",
                columns: new[] { "UserId", "AcademicSurveySubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveys_CreatedByUserId",
                table: "AcademicSurveys",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveys_UpdatedByUserId",
                table: "AcademicSurveys",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_AcademicSurveyId",
                table: "AcademicSurveySubjects",
                column: "AcademicSurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_CreatedByUserId",
                table: "AcademicSurveySubjects",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_ProfessorUserId",
                table: "AcademicSurveySubjects",
                column: "ProfessorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_SubjectId",
                table: "AcademicSurveySubjects",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_TechnicalCareerId",
                table: "AcademicSurveySubjects",
                column: "TechnicalCareerId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_UpdatedByUserId",
                table: "AcademicSurveySubjects",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestionOptions_CreatedByUserId",
                table: "FormQuestionOptions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestionOptions_UpdatedByUserId",
                table: "FormQuestionOptions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveyResponseId_AcademicSu~",
                table: "SurveyQuestionResponses",
                columns: new[] { "AcademicSurveyResponseId", "AcademicSurveySubjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveySubjectId",
                table: "SurveyQuestionResponses",
                column: "AcademicSurveySubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_CreatedByUserId",
                table: "SurveyQuestionResponses",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_FormQuestionId",
                table: "SurveyQuestionResponses",
                column: "FormQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_UpdatedByUserId",
                table: "SurveyQuestionResponses",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestionOptions_CreatedByUserId",
                table: "SurveyTemplateQuestionOptions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestionOptions_TemplateQuestionId_Value",
                table: "SurveyTemplateQuestionOptions",
                columns: new[] { "TemplateQuestionId", "Value" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestionOptions_UpdatedByUserId",
                table: "SurveyTemplateQuestionOptions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestions_CreatedByUserId",
                table: "SurveyTemplateQuestions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestions_TemplateId_Order",
                table: "SurveyTemplateQuestions",
                columns: new[] { "TemplateId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestions_UpdatedByUserId",
                table: "SurveyTemplateQuestions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplates_CreatedByUserId",
                table: "SurveyTemplates",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplates_UpdatedByUserId",
                table: "SurveyTemplates",
                column: "UpdatedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormQuestionOptions");

            migrationBuilder.DropTable(
                name: "SurveyQuestionResponses");

            migrationBuilder.DropTable(
                name: "SurveyTemplateQuestionOptions");

            migrationBuilder.DropTable(
                name: "AcademicSurveyResponses");

            migrationBuilder.DropTable(
                name: "SurveyTemplateQuestions");

            migrationBuilder.DropTable(
                name: "AcademicSurveySubjects");

            migrationBuilder.DropTable(
                name: "SurveyTemplates");

            migrationBuilder.DropTable(
                name: "AcademicSurveys");

            migrationBuilder.DropColumn(
                name: "Orden",
                table: "FormQuestions");

            migrationBuilder.RenameColumn(
                name: "QuestionType",
                table: "FormQuestions",
                newName: "Order");

            migrationBuilder.AlterColumn<int>(
                name: "CompetencyLevel",
                table: "StudentCompetencyAssessments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "FormQuestions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "FormQuestions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "QuestionResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    FormQuestionId = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true),
                    Comments = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    ResponseValue = table.Column<int>(type: "integer", nullable: false),
                    StudentCompetencyEvaluationId = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
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
        }
    }
}
