using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.Listings.DTOs;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Kitab.Infrastructure.Listings;

public class ListingRepository : IListingRepository
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public ListingRepository(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<Result<ListingDto>> CreateAsync(
        Guid identityUserId,
        string title,
        string author,
        string category,
        ListingCondition condition,
        string description,
        ListingType listingType,
        ListingStatus status,
        decimal? price,
        IReadOnlyList<string> imageUrls,
        CancellationToken cancellationToken)
    {
        var owner = await _dbContext.DomainUsers
            .SingleOrDefaultAsync(user => user.IdentityUserId == identityUserId, cancellationToken);

        if (owner is null)
        {
            return Result<ListingDto>.Failure("Listing owner profile was not found.");
        }

        var listing = new Listing
        {
            Id = Guid.NewGuid(),
            OwnerId = owner.Id,
            Title = title.Trim(),
            Author = author.Trim(),
            Category = category.Trim(),
            Condition = condition,
            Description = description.Trim(),
            ListingType = listingType,
            Status = status,
            Price = price,
            ImageUrls = imageUrls.Where(url => !string.IsNullOrWhiteSpace(url)).Select(url => url.Trim()).ToList(),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Listings.Add(listing);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<ListingDto>.Success(_mapper.Map<ListingDto>(listing));
    }

    public Task<ListingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.Listings
            .AsNoTracking()
            .Where(listing => listing.Id == id && !listing.IsDeleted)
            .ProjectTo<ListingDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ListingDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Listings
            .AsNoTracking()
            .Where(listing => !listing.IsDeleted)
            .OrderByDescending(listing => listing.CreatedAt)
            .ProjectTo<ListingDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ListingDto>> GetMineAsync(
        Guid identityUserId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.Listings
            .AsNoTracking()
            .Where(listing => !listing.IsDeleted && listing.Owner!.IdentityUserId == identityUserId)
            .OrderByDescending(listing => listing.CreatedAt)
            .ProjectTo<ListingDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ListingDto>> SearchAsync(
        string? term,
        ListingCondition? condition,
        ListingType? listingType,
        decimal? minPrice,
        decimal? maxPrice,
        CancellationToken cancellationToken)
    {
        var query = _dbContext.Listings
            .AsNoTracking()
            .Where(listing => !listing.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(term))
        {
            var normalizedTerm = term.Trim();
            var pattern = $"%{normalizedTerm}%";
            query = query.Where(listing =>
                EF.Functions.Like(listing.Title, pattern) ||
                EF.Functions.Like(listing.Author, pattern) ||
                EF.Functions.Like(listing.Category, pattern));
        }

        if (condition.HasValue)
        {
            query = query.Where(listing => listing.Condition == condition.Value);
        }

        if (listingType.HasValue)
        {
            query = query.Where(listing => listing.ListingType == listingType.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(listing => listing.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(listing => listing.Price <= maxPrice.Value);
        }

        return await query
            .OrderByDescending(listing => listing.CreatedAt)
            .ProjectTo<ListingDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    public async Task<Result<ListingDto>> UpdateAsync(
        Guid id,
        Guid identityUserId,
        string title,
        string author,
        string category,
        ListingCondition condition,
        string description,
        ListingType listingType,
        ListingStatus status,
        decimal? price,
        IReadOnlyList<string> imageUrls,
        CancellationToken cancellationToken)
    {
        var listing = await _dbContext.Listings
            .Include(item => item.Owner)
            .SingleOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

        if (listing is null)
        {
            return Result<ListingDto>.Failure("Listing was not found.");
        }

        if (listing.Owner?.IdentityUserId != identityUserId)
        {
            return Result<ListingDto>.Failure("You can only update your own listings.");
        }

        listing.Title = title.Trim();
        listing.Author = author.Trim();
        listing.Category = category.Trim();
        listing.Condition = condition;
        listing.Description = description.Trim();
        listing.ListingType = listingType;
        listing.Status = status;
        listing.Price = price;
        listing.ImageUrls = imageUrls.Where(url => !string.IsNullOrWhiteSpace(url)).Select(url => url.Trim()).ToList();
        listing.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<ListingDto>.Success(_mapper.Map<ListingDto>(listing));
    }

    public async Task<Result> DeleteAsync(Guid id, Guid identityUserId, CancellationToken cancellationToken)
    {
        var listing = await _dbContext.Listings
            .Include(item => item.Owner)
            .SingleOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

        if (listing is null)
        {
            return Result.Failure("Listing was not found.");
        }

        if (listing.Owner?.IdentityUserId != identityUserId)
        {
            return Result.Failure("You can only delete your own listings.");
        }

        listing.IsDeleted = true;
        listing.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> AdminDeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var listing = await _dbContext.Listings
            .SingleOrDefaultAsync(item => item.Id == id && !item.IsDeleted, cancellationToken);

        if (listing is null)
        {
            return Result.Failure("Listing was not found.");
        }

        listing.IsDeleted = true;
        listing.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
