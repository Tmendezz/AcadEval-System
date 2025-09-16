using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExtraFieldsFromAcademicSurveySubject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveySubjects_Professors_ProfessorUserId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveySubjects_TechnicalCareers_TechnicalCareerId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveySubjects_ProfessorUserId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveySubjects_TechnicalCareerId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropColumn(
                name: "ProfessorUserId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropColumn(
                name: "TechnicalCareerId",
                table: "AcademicSurveySubjects");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "AcademicSurveySubjects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfessorUserId",
                table: "AcademicSurveySubjects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TechnicalCareerId",
                table: "AcademicSurveySubjects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "AcademicSurveySubjects",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_ProfessorUserId",
                table: "AcademicSurveySubjects",
                column: "ProfessorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveySubjects_TechnicalCareerId",
                table: "AcademicSurveySubjects",
                column: "TechnicalCareerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveySubjects_Professors_ProfessorUserId",
                table: "AcademicSurveySubjects",
                column: "ProfessorUserId",
                principalTable: "Professors",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveySubjects_TechnicalCareers_TechnicalCareerId",
                table: "AcademicSurveySubjects",
                column: "TechnicalCareerId",
                principalTable: "TechnicalCareers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
