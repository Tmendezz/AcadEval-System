using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSurveyTemplateModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDraft",
                table: "SurveyTemplates",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "SurveyTemplates",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SurveyType",
                table: "SurveyTemplates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SurveyTemplates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SurveyTemplateId",
                table: "SurveyTemplateQuestions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AllowOpenText",
                table: "SurveyTemplateQuestionOptions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "SurveyTemplateQuestionOptions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SurveyTemplateQuestionId",
                table: "SurveyTemplateQuestionOptions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestions_SurveyTemplateId",
                table: "SurveyTemplateQuestions",
                column: "SurveyTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyTemplateQuestionOptions_SurveyTemplateQuestionId",
                table: "SurveyTemplateQuestionOptions",
                column: "SurveyTemplateQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyTemplateQuestionOptions_SurveyTemplateQuestions_Surve~",
                table: "SurveyTemplateQuestionOptions",
                column: "SurveyTemplateQuestionId",
                principalTable: "SurveyTemplateQuestions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyTemplateQuestions_SurveyTemplates_SurveyTemplateId",
                table: "SurveyTemplateQuestions",
                column: "SurveyTemplateId",
                principalTable: "SurveyTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyTemplateQuestionOptions_SurveyTemplateQuestions_Surve~",
                table: "SurveyTemplateQuestionOptions");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyTemplateQuestions_SurveyTemplates_SurveyTemplateId",
                table: "SurveyTemplateQuestions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyTemplateQuestions_SurveyTemplateId",
                table: "SurveyTemplateQuestions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyTemplateQuestionOptions_SurveyTemplateQuestionId",
                table: "SurveyTemplateQuestionOptions");

            migrationBuilder.DropColumn(
                name: "IsDraft",
                table: "SurveyTemplates");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "SurveyTemplates");

            migrationBuilder.DropColumn(
                name: "SurveyType",
                table: "SurveyTemplates");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SurveyTemplates");

            migrationBuilder.DropColumn(
                name: "SurveyTemplateId",
                table: "SurveyTemplateQuestions");

            migrationBuilder.DropColumn(
                name: "AllowOpenText",
                table: "SurveyTemplateQuestionOptions");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "SurveyTemplateQuestionOptions");

            migrationBuilder.DropColumn(
                name: "SurveyTemplateQuestionId",
                table: "SurveyTemplateQuestionOptions");
        }
    }
}
