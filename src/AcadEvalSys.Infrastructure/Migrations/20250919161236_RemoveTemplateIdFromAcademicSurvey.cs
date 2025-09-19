using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTemplateIdFromAcademicSurvey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Eliminar la restricción de clave foránea
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveys_SurveyTemplates_TemplateId",
                table: "AcademicSurveys");

            // Eliminar el índice
            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveys_TemplateId",
                table: "AcademicSurveys");

            // Eliminar la columna TemplateId
            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "AcademicSurveys");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Restaurar la columna TemplateId
            migrationBuilder.AddColumn<Guid>(
                name: "TemplateId",
                table: "AcademicSurveys",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            // Restaurar el índice
            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveys_TemplateId",
                table: "AcademicSurveys",
                column: "TemplateId");

            // Restaurar la restricción de clave foránea
            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveys_SurveyTemplates_TemplateId",
                table: "AcademicSurveys",
                column: "TemplateId",
                principalTable: "SurveyTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
