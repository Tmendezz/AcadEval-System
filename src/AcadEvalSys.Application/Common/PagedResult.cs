namespace AcadEvalSys.Application.Common;

public class PagedResult<T>
{
    public PagedResult(IEnumerable<T> items, int totalCount, int pageNumber, int pageSize)
    {
        Items = items;
        TotalItemsCount = totalCount;

        var currentPageNumber = pageNumber;
        var currentPageSize = pageSize;

        TotalPages = (int)Math.Ceiling(totalCount / (double)currentPageSize);
        ItemsFrom = totalCount > 0 ? (currentPageSize * (currentPageNumber - 1) + 1) : 0;
        ItemsTo = totalCount > 0 ? Math.Min((ItemsFrom + currentPageSize - 1), TotalItemsCount) : 0;
    }

    public IEnumerable<T> Items { get; set; }
    public int TotalPages { get; set; }
    public int TotalItemsCount { get; set; }
    public int ItemsFrom { get; set; }
    public int ItemsTo { get; set; }
}