using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAllowCommentToSurveyQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowComment",
                table: "SurveyTemplateQuestions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AllowComment",
                table: "SurveyQuestions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowComment",
                table: "SurveyTemplateQuestions");

            migrationBuilder.DropColumn(
                name: "AllowComment",
                table: "SurveyQuestions");
        }
    }
}
