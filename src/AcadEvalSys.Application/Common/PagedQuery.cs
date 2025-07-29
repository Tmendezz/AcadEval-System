using AcadEvalSys.Application.Common;
using MediatR;

namespace AcadEvalSys.Application.Common;

public abstract class PagedQuery<TResponse> : IRequest<PagedResult<TResponse>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
}
