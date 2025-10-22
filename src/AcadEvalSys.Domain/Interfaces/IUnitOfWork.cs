
using System.Threading;
using System.Threading.Tasks;

namespace AcadEvalSys.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task<ITransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
    }

    public interface ITransaction : IAsyncDisposable
    {
        Task CommitAsync(CancellationToken cancellationToken = default);
        Task RollbackAsync(CancellationToken cancellationToken = default);
    }
}
