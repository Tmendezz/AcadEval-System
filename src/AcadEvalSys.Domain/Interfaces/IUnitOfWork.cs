
using System.Threading;
using System.Threading.Tasks;

namespace AcadEvalSys.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
