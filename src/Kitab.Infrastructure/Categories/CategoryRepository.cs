using Kitab.Application.Categories.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kitab.Infrastructure.Categories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _dbContext;

    public CategoryRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<CategoryDto>> CreateAsync(
        string name,
        string? description,
        CancellationToken cancellationToken)
    {
        var normalizedName = name.Trim();
        if (await ActiveNameExistsAsync(normalizedName, null, cancellationToken))
        {
            return Result<CategoryDto>.Failure("A category with this name already exists.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = normalizedName,
            Description = NormalizeDescription(description),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<CategoryDto>.Success(ToDto(category));
    }

    public async Task<IReadOnlyCollection<CategoryDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(category => !category.IsDeleted)
            .OrderBy(category => category.Name)
            .Select(category => ToDto(category))
            .ToListAsync(cancellationToken);
    }

    public async Task<Result<CategoryDto>> UpdateAsync(
        Guid id,
        string name,
        string? description,
        CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories
            .SingleOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

        if (category is null)
        {
            return Result<CategoryDto>.Failure("Category was not found.");
        }

        var normalizedName = name.Trim();
        if (await ActiveNameExistsAsync(normalizedName, id, cancellationToken))
        {
            return Result<CategoryDto>.Failure("A category with this name already exists.");
        }

        category.Name = normalizedName;
        category.Description = NormalizeDescription(description);
        category.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<CategoryDto>.Success(ToDto(category));
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories
            .SingleOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

        if (category is null)
        {
            return Result.Failure("Category was not found.");
        }

        category.IsDeleted = true;
        category.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    private Task<bool> ActiveNameExistsAsync(
        string name,
        Guid? excludedCategoryId,
        CancellationToken cancellationToken)
    {
        return _dbContext.Categories.AnyAsync(
            category =>
                !category.IsDeleted &&
                category.Name == name &&
                (!excludedCategoryId.HasValue || category.Id != excludedCategoryId.Value),
            cancellationToken);
    }

    private static string? NormalizeDescription(string? description)
    {
        return string.IsNullOrWhiteSpace(description) ? null : description.Trim();
    }

    private static CategoryDto ToDto(Category category)
    {
        return new CategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.CreatedAt,
            category.UpdatedAt);
    }
}
