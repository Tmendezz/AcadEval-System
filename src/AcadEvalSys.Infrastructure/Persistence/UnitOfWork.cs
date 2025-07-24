
using System.Threading;
using System.Threading.Tasks;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Persistence;

namespace AcadEvalSys.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
