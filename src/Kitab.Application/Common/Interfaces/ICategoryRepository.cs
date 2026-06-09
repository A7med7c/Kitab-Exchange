using Kitab.Application.Categories.DTOs;
using Kitab.Application.Common.Models;

namespace Kitab.Application.Common.Interfaces;

public interface ICategoryRepository
{
    Task<Result<CategoryDto>> CreateAsync(
        string name,
        string? description,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<CategoryDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<Result<CategoryDto>> UpdateAsync(
        Guid id,
        string name,
        string? description,
        CancellationToken cancellationToken);

    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
