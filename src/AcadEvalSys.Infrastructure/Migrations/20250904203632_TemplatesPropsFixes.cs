using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TemplatesPropsFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "SurveyTemplates",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "SurveyTemplates",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "SurveyTemplates");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "SurveyTemplates",
                newName: "Name");
        }
    }
}
