using Kitab.Application.Common.Models;
using Kitab.Application.Listings.DTOs;
using Kitab.Domain.Entities;

namespace Kitab.Application.Common.Interfaces;

public interface IListingRepository
{
    Task<Result<ListingDto>> CreateAsync(
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
        CancellationToken cancellationToken);

    Task<ListingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ListingDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ListingDto>> GetMineAsync(Guid identityUserId, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ListingDto>> SearchAsync(
        string? term,
        ListingCondition? condition,
        ListingType? listingType,
        decimal? minPrice,
        decimal? maxPrice,
        CancellationToken cancellationToken);

    Task<Result<ListingDto>> UpdateAsync(
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
        CancellationToken cancellationToken);

    Task<Result> DeleteAsync(Guid id, Guid identityUserId, CancellationToken cancellationToken);

    Task<Result> AdminDeleteAsync(Guid id, CancellationToken cancellationToken);
}
