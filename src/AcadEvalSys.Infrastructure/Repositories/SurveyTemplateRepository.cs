using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Infrastructure.Repositories
{
    public class SurveyTemplateRepository(ApplicationDbContext dbContext) : ISurveyTemplateRepository
    {
        public async Task<Guid> CreateAsync(SurveyTemplate template, CancellationToken ct = default)
        {
            var result = dbContext.SurveyTemplates.Add(template);
            await dbContext.SaveChangesAsync(ct);
            return result.Entity.Id;
        }

        public async Task<bool> ExistsNameAsync(string name, SurveyType type, Guid? excludingId = null, CancellationToken ct = default)
        {
            return await dbContext.SurveyTemplates
                .AnyAsync(s => s.IsActive
                && s.Title == name
                && s.SurveyType == type
                && (!excludingId.HasValue || s.Id != excludingId.Value), ct);
        }

        public async Task<SurveyTemplate?> GetTemplateByIdAsync(
        Guid id, bool includeChildren = true, CancellationToken ct = default)
        {
            if (!includeChildren)
            {
                return await dbContext.SurveyTemplates
                    .AsNoTracking()
                    .SingleOrDefaultAsync(t => t.Id == id && t.IsActive, ct);
            }

            return await dbContext.SurveyTemplates
                .AsNoTracking()
                .Where(t => t.Id == id && t.IsActive)
                .Include(t => t.Questions
                    .Where(q => q.IsActive)
                    .OrderBy(q => q.Order))
                    .ThenInclude(q => q.Options
                        .Where(o => o.IsActive)
                        .OrderBy(o => o.Order))
                .AsSplitQuery() // colecciones → evita joins gigantes
                .SingleOrDefaultAsync(ct);
        }

        public async Task<IReadOnlyList<SurveyTemplate>> ListAsync(bool? isDraft = null, string? search = null, SurveyType? type = null, CancellationToken ct = default)
        {
            return await dbContext.SurveyTemplates
                .Include(t => t.Questions)
                .Where(c => c.IsActive)
                .Where(c => !isDraft.HasValue || c.IsDraft == isDraft.Value)
                .Where(c => !type.HasValue || c.SurveyType == type.Value)
                .Where(c => string.IsNullOrEmpty(search) || c.Title.Contains(search))
                .OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task SoftDeleteAsync(Guid id, CancellationToken ct = default)
        {
            await using var tx = await dbContext.Database.BeginTransactionAsync(ct);

            // Verifico que exista y esté activa
            var exists = await dbContext.SurveyTemplates
                .AnyAsync(t => t.Id == id && t.IsActive, ct);
            if (!exists) return;

            var now = DateTime.UtcNow;

            // 1) Opciones de las preguntas de la plantilla
            await dbContext.SurveyTemplateQuestionOptions
                .Where(o => o.IsActive &&
                            dbContext.SurveyTemplateQuestions
                                .Where(q => q.TemplateId == id && q.IsActive)
                                .Select(q => q.Id)
                                .Contains(o.TemplateQuestionId))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(o => o.IsActive, false)
                    .SetProperty(o => o.UpdatedAt, now), ct);

            // 2) Preguntas de la plantilla
            await dbContext.SurveyTemplateQuestions
                .Where(q => q.TemplateId == id && q.IsActive)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(q => q.IsActive, false)
                    .SetProperty(q => q.UpdatedAt, now), ct);

            // 3) La plantilla
            await dbContext.SurveyTemplates
                .Where(t => t.Id == id && t.IsActive)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(t => t.IsActive, false)
                    .SetProperty(t => t.UpdatedAt, now), ct);

            await tx.CommitAsync(ct);
        }

        public async Task UpdateAsync(SurveyTemplate incoming, CancellationToken ct = default)
        {
            await using var tx = await dbContext.Database.BeginTransactionAsync(ct);

            var current = await dbContext.SurveyTemplates
                .Include(t => t.Questions).ThenInclude(q => q.Options)
                .SingleOrDefaultAsync(t => t.Id == incoming.Id && t.IsActive, ct);

            if (current is null)
                throw new KeyNotFoundException("Template not found or inactive");

            var now = DateTime.UtcNow;

            // ---- actualizar cabecera ----
            current.Title = incoming.Title;
            current.Description = incoming.Description;
            current.SurveyType = incoming.SurveyType;
            current.IsDraft = incoming.IsDraft;
            current.UpdatedAt = now;
            current.UpdatedByUserId = incoming.UpdatedByUserId;

            // ---- sync preguntas ----
            var incomingQIds = incoming.Questions.Where(q => q.Id != Guid.Empty).Select(q => q.Id).ToHashSet();

            // eliminar las que no vienen
            var toRemoveQ = current.Questions.Where(q => !incomingQIds.Contains(q.Id)).ToList();
            dbContext.SurveyTemplateQuestions.RemoveRange(toRemoveQ);

            foreach (var qIn in incoming.Questions)
            {
                var qCur = current.Questions.FirstOrDefault(q => q.Id == qIn.Id);

                if (qCur is null) // nueva
                {
                    qIn.TemplateId = current.Id;
                    current.Questions.Add(qIn);
                }
                else // update
                {
                    qCur.Text = qIn.Text;
                    qCur.Type = qIn.Type;
                    qCur.Order = qIn.Order;
                    qCur.isRequired = qIn.isRequired;
                    qCur.UpdatedAt = now;

                    // ---- sync opciones ----
                    var incomingOIds = qIn.Options.Where(o => o.Id != Guid.Empty).Select(o => o.Id).ToHashSet();
                    var toRemoveO = qCur.Options.Where(o => !incomingOIds.Contains(o.Id)).ToList();
                    dbContext.SurveyTemplateQuestionOptions.RemoveRange(toRemoveO);

                    foreach (var oIn in qIn.Options)
                    {
                        var oCur = qCur.Options.FirstOrDefault(o => o.Id == oIn.Id);
                        if (oCur is null) // nueva
                        {
                            oIn.TemplateQuestionId = qCur.Id;
                            qCur.Options.Add(oIn);
                        }
                        else // update
                        {
                            oCur.Value = oIn.Value;
                            oCur.Text = oIn.Text;
                            oCur.Order = oIn.Order;
                            oCur.AllowOpenText = oIn.AllowOpenText;
                            oCur.UpdatedAt = now;
                        }
                    }
                }
            }

            await dbContext.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);
        }

    }
}
