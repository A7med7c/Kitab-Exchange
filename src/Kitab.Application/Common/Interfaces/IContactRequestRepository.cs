using Kitab.Application.Common.Models;
using Kitab.Application.ContactRequests.DTOs;
using Kitab.Domain.Entities;

namespace Kitab.Application.Common.Interfaces;

public interface IContactRequestRepository
{
    Task<Result<ContactRequestDto>> CreateAsync(
        Guid identityUserId,
        Guid listingId,
        RequestType requestType,
        Guid? offeredListingId,
        string? message,
        CancellationToken cancellationToken);

    Task<Result<ContactRequestDto>> AcceptAsync(
        Guid id,
        Guid identityUserId,
        CancellationToken cancellationToken);

    Task<Result<ContactRequestDto>> RejectAsync(
        Guid id,
        Guid identityUserId,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ContactRequestDto>> GetIncomingAsync(
        Guid identityUserId,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<ContactRequestDto>> GetOutgoingAsync(
        Guid identityUserId,
        CancellationToken cancellationToken);
}
