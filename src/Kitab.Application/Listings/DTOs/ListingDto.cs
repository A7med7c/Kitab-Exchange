using Kitab.Domain.Entities;

namespace Kitab.Application.Listings.DTOs;

public record ListingDto(
    Guid Id,
    Guid OwnerId,
    string Title,
    string Author,
    string Category,
    ListingCondition Condition,
    string Description,
    ListingType ListingType,
    ListingStatus Status,
    decimal? Price,
    IReadOnlyList<string> ImageUrls,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);

public record UploadImageResponseDto(string Url);
