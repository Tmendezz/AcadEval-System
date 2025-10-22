using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixAcademicSurveyResponseUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId1",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropIndex(
                name: "IX_AcademicSurveyResponses_UserId1",
                table: "AcademicSurveyResponses");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "AcademicSurveyResponses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "AcademicSurveyResponses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_AcademicSurveyResponses_UserId1",
                table: "AcademicSurveyResponses",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AcademicSurveyResponses_AspNetUsers_UserId1",
                table: "AcademicSurveyResponses",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
