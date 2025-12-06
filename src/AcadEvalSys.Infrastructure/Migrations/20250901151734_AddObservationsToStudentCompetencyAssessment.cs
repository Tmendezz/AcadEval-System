using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddObservationsToStudentCompetencyAssessment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Observations",
                table: "StudentCompetencyAssessments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Observations",
                table: "StudentCompetencyAssessments");
        }
    }
}
