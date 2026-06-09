using Kitab.Domain.Entities;

namespace Kitab.Application.ContactRequests.DTOs;

public record ContactRequestDto(
    Guid Id,
    Guid ListingId,
    string ListingTitle,
    string ListingAuthor,
    Guid RequesterId,
    string RequesterName,
    Guid OwnerId,
    string OwnerName,
    ContactRequestStatus Status,
    RequestType RequestType,
    Guid? OfferedListingId,
    string? OfferedListingTitle,
    string? Message,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
