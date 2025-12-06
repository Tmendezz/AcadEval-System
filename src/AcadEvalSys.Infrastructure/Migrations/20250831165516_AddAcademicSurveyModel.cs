using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicSurveyModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyQuestionResponses_AcademicSurveySubjects_AcademicSurv~",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyQuestionResponses_FormQuestions_FormQuestionId",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropTable(
                name: "FormQuestionOptions");

            migrationBuilder.DropTable(
                name: "FormQuestions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveyResponseId_AcademicSu~",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveySubjectId",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveyResponses_UserId_AcademicSurveySubjectId",
                table: "AcademicSurveyResponses");

            migrationBuilder.RenameColumn(
                name: "FormQuestionId",
                table: "SurveyQuestionResponses",
                newName: "SurveyQuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyQuestionResponses_FormQuestionId",
                table: "SurveyQuestionResponses",
                newName: "IX_SurveyQuestionResponses_SurveyQuestionId");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "SurveyQuestionResponses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TemplateId",
                table: "AcademicSurveys",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "AcademicSurveyResponses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "SurveyQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademicSurveyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: true),
                    IsRequired = table.Column<bool>(type: "boolean", nullable: false),
                    CompetencyId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyQuestions_AcademicSurveys_AcademicSurveyId",
                        column: x => x.AcademicSurveyId,
                        principalTable: "AcademicSurveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyQuestions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestions_Competencies_CompetencyId",
                        column: x => x.CompetencyId,
                        principalTable: "Competencies",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SurveyQuestionOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SurveyQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: true),
                    AllowOpenText = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyQuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyQuestionOptions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestionOptions_AspNetUsers_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SurveyQuestionOptions_SurveyQuestions_SurveyQuestionId",
                        column: x => x.SurveyQuestionId,
                        principalTable: "SurveyQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveyResponseId_SurveyQues~",
                table: "SurveyQuestionResponses",
                columns: new[] { "AcademicSurveyResponseId", "SurveyQuestionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveys_TemplateId",
                table: "AcademicSurveys",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UserId",
                table: "AcademicSurveyResponses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UserId1",
                table: "AcademicSurveyResponses",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionOptions_CreatedByUserId",
                table: "SurveyQuestionOptions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionOptions_SurveyQuestionId_Value",
                table: "SurveyQuestionOptions",
                columns: new[] { "SurveyQuestionId", "Value" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionOptions_UpdatedByUserId",
                table: "SurveyQuestionOptions",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestions_AcademicSurveyId",
                table: "SurveyQuestions",
                column: "AcademicSurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestions_CompetencyId",
                table: "SurveyQuestions",
                column: "CompetencyId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestions_CreatedByUserId",
                table: "SurveyQuestions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestions_UpdatedByUserId",
                table: "SurveyQuestions",
                column: "UpdatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId",
                table: "AcademicSurveyResponses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId1",
                table: "AcademicSurveyResponses",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveys_SurveyTemplates_TemplateId",
                table: "AcademicSurveys",
                column: "TemplateId",
                principalTable: "SurveyTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyQuestionResponses_SurveyQuestions_SurveyQuestionId",
                table: "SurveyQuestionResponses",
                column: "SurveyQuestionId",
                principalTable: "SurveyQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId1",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveys_SurveyTemplates_TemplateId",
                table: "AcademicSurveys");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyQuestionResponses_SurveyQuestions_SurveyQuestionId",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropTable(
                name: "SurveyQuestionOptions");

            migrationBuilder.DropTable(
                name: "SurveyQuestions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveyResponseId_SurveyQues~",
                table: "SurveyQuestionResponses");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveys_TemplateId",
                table: "AcademicSurveys");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveyResponses_UserId",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveyResponses_UserId1",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "AcademicSurveys");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "AcademicSurveyResponses");

            migrationBuilder.RenameColumn(
                name: "SurveyQuestionId",
                table: "SurveyQuestionResponses",
                newName: "FormQuestionId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyQuestionResponses_SurveyQuestionId",
                table: "SurveyQuestionResponses",
                newName: "IX_SurveyQuestionResponses_FormQuestionId");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "SurveyQuestionResponses",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "FormQuestionOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FormQuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Value = table.Column<int>(type: "integer", nullable: false)
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
                name: "FormQuestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: true),
                    UpdatedByUserId = table.Column<string>(type: "text", nullable: true),
                    CompetencyId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Orden = table.Column<int>(type: "integer", nullable: false),
                    QuestionType = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveyResponseId_AcademicSu~",
                table: "SurveyQuestionResponses",
                columns: new[] { "AcademicSurveyResponseId", "AcademicSurveySubjectId" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyQuestionResponses_AcademicSurveySubjectId",
                table: "SurveyQuestionResponses",
                column: "AcademicSurveySubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UserId_AcademicSurveySubjectId",
                table: "AcademicSurveyResponses",
                columns: new[] { "UserId", "AcademicSurveySubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestionOptions_CreatedByUserId",
                table: "FormQuestionOptions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FormQuestionOptions_UpdatedByUserId",
                table: "FormQuestionOptions",
                column: "UpdatedByUserId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId",
                table: "AcademicSurveyResponses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyQuestionResponses_AcademicSurveySubjects_AcademicSurv~",
                table: "SurveyQuestionResponses",
                column: "AcademicSurveySubjectId",
                principalTable: "AcademicSurveySubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyQuestionResponses_FormQuestions_FormQuestionId",
                table: "SurveyQuestionResponses",
                column: "FormQuestionId",
                principalTable: "FormQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
