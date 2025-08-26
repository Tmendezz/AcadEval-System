using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicYearToStudentSubject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Coordinators_TechnicalCareerId",
                table: "Coordinators");

            migrationBuilder.AddColumn<int>(
                name: "AcademicYear",
                table: "StudentSubjects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "CompetencyLevel",
                table: "StudentCompetencyAssessments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coordinators_TechnicalCareerId",
                table: "Coordinators",
                column: "TechnicalCareerId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Coordinators_TechnicalCareerId",
                table: "Coordinators");

            migrationBuilder.DropColumn(
                name: "AcademicYear",
                table: "StudentSubjects");

            migrationBuilder.AlterColumn<int>(
                name: "CompetencyLevel",
                table: "StudentCompetencyAssessments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_Coordinators_TechnicalCareerId",
                table: "Coordinators",
                column: "TechnicalCareerId");
        }
    }
}
