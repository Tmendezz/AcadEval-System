using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AcadEvalSys.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExistingDataToNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Actualizar registros existentes que tengan CompetencyLevel = 0 (Inicial) a NULL
            migrationBuilder.Sql(@"
                UPDATE ""StudentCompetencyAssessments"" 
                SET ""CompetencyLevel"" = NULL 
                WHERE ""CompetencyLevel"" = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revertir: establecer CompetencyLevel = 0 (Inicial) para registros que tengan NULL
            migrationBuilder.Sql(@"
                UPDATE ""StudentCompetencyAssessments"" 
                SET ""CompetencyLevel"" = 0 
                WHERE ""CompetencyLevel"" IS NULL");
        }
    }
}
