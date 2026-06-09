using AutoMapper;
using AutoMapper.QueryableExtensions;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.ContactRequests.DTOs;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kitab.Infrastructure.ContactRequests;

public class ContactRequestRepository : IContactRequestRepository
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public ContactRequestRepository(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<Result<ContactRequestDto>> CreateAsync(
        Guid identityUserId,
        Guid listingId,
        RequestType requestType,
        Guid? offeredListingId,
        string? message,
        CancellationToken cancellationToken)
    {
        var requester = await _dbContext.DomainUsers
            .SingleOrDefaultAsync(user => user.IdentityUserId == identityUserId, cancellationToken);

        if (requester is null)
        {
            return Result<ContactRequestDto>.Failure("Requester profile was not found.");
        }

        var listing = await _dbContext.Listings
            .Include(item => item.Owner)
            .SingleOrDefaultAsync(item => item.Id == listingId && !item.IsDeleted, cancellationToken);

        if (listing is null)
        {
            return Result<ContactRequestDto>.Failure("Listing was not found.");
        }

        if (listing.OwnerId == requester.Id)
        {
            return Result<ContactRequestDto>.Failure("You cannot send a contact request for your own listing.");
        }

        if (requestType == RequestType.Exchange)
        {
            if (offeredListingId is null)
            {
                return Result<ContactRequestDto>.Failure("An offered listing is required for exchange requests.");
            }
            
            var offeredListing = await _dbContext.Listings
                .SingleOrDefaultAsync(item => item.Id == offeredListingId && item.OwnerId == requester.Id && !item.IsDeleted, cancellationToken);
                
            if (offeredListing is null)
            {
                return Result<ContactRequestDto>.Failure("Offered listing was not found or does not belong to you.");
            }
        }

        var hasPendingRequest = await _dbContext.ContactRequests.AnyAsync(
            contactRequest =>
                contactRequest.ListingId == listingId &&
                contactRequest.RequesterId == requester.Id &&
                contactRequest.Status == ContactRequestStatus.Pending,
            cancellationToken);

        if (hasPendingRequest)
        {
            return Result<ContactRequestDto>.Failure("A pending contact request already exists for this listing.");
        }

        var contactRequest = new ContactRequest
        {
            Id = Guid.NewGuid(),
            ListingId = listing.Id,
            RequesterId = requester.Id,
            OwnerId = listing.OwnerId,
            Status = ContactRequestStatus.Pending,
            RequestType = requestType,
            OfferedListingId = offeredListingId,
            Message = string.IsNullOrWhiteSpace(message) ? null : message.Trim(),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.ContactRequests.Add(contactRequest);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<ContactRequestDto>.Success(_mapper.Map<ContactRequestDto>(contactRequest));
    }

    public Task<Result<ContactRequestDto>> AcceptAsync(
        Guid id,
        Guid identityUserId,
        CancellationToken cancellationToken)
    {
        return UpdateStatusAsync(id, identityUserId, ContactRequestStatus.Accepted, cancellationToken);
    }

    public Task<Result<ContactRequestDto>> RejectAsync(
        Guid id,
        Guid identityUserId,
        CancellationToken cancellationToken)
    {
        return UpdateStatusAsync(id, identityUserId, ContactRequestStatus.Rejected, cancellationToken);
    }

    public async Task<IReadOnlyCollection<ContactRequestDto>> GetIncomingAsync(
        Guid identityUserId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.ContactRequests
            .AsNoTracking()
            .Include(contactRequest => contactRequest.Listing)
            .Include(contactRequest => contactRequest.OfferedListing)
            .Include(contactRequest => contactRequest.Requester)
            .Include(contactRequest => contactRequest.Owner)
            .Where(contactRequest => contactRequest.Owner!.IdentityUserId == identityUserId)
            .OrderByDescending(contactRequest => contactRequest.CreatedAt)
            .ProjectTo<ContactRequestDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ContactRequestDto>> GetOutgoingAsync(
        Guid identityUserId,
        CancellationToken cancellationToken)
    {
        return await _dbContext.ContactRequests
            .AsNoTracking()
            .Include(contactRequest => contactRequest.Listing)
            .Include(contactRequest => contactRequest.OfferedListing)
            .Include(contactRequest => contactRequest.Requester)
            .Include(contactRequest => contactRequest.Owner)
            .Where(contactRequest => contactRequest.Requester!.IdentityUserId == identityUserId)
            .OrderByDescending(contactRequest => contactRequest.CreatedAt)
            .ProjectTo<ContactRequestDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    private async Task<Result<ContactRequestDto>> UpdateStatusAsync(
        Guid id,
        Guid identityUserId,
        ContactRequestStatus status,
        CancellationToken cancellationToken)
    {
        var contactRequest = await _dbContext.ContactRequests
            .Include(item => item.Owner)
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (contactRequest is null)
        {
            return Result<ContactRequestDto>.Failure("Contact request was not found.");
        }

        if (contactRequest.Owner?.IdentityUserId != identityUserId)
        {
            return Result<ContactRequestDto>.Failure("You can only respond to contact requests for your own listings.");
        }

        if (contactRequest.Status != ContactRequestStatus.Pending)
        {
            return Result<ContactRequestDto>.Failure("Only pending contact requests can be updated.");
        }

        contactRequest.Status = status;
        contactRequest.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<ContactRequestDto>.Success(_mapper.Map<ContactRequestDto>(contactRequest));
    }
}
