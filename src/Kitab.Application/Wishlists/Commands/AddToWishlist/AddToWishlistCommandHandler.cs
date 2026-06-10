using Kitab.Application.Common.Exceptions;
using Kitab.Application.Common.Interfaces;
using Kitab.Domain.Entities;
using MediatR;

namespace Kitab.Application.Wishlists.Commands.AddToWishlist;

public class AddToWishlistCommandHandler : IRequestHandler<AddToWishlistCommand>
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly IListingRepository _listingRepository;
    private readonly ICurrentUserService _currentUserService;

    public AddToWishlistCommandHandler(
        IWishlistRepository wishlistRepository,
        IListingRepository listingRepository,
        ICurrentUserService currentUserService)
    {
        _wishlistRepository = wishlistRepository;
        _listingRepository = listingRepository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(AddToWishlistCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var listing = await _listingRepository.GetByIdAsync(request.ListingId, cancellationToken);
        if (listing == null)
        {
            throw new NotFoundException($"Listing {request.ListingId} not found.");
        }

        if (listing.OwnerId == userId.Value)
        {
            throw new InvalidOperationException("You cannot add your own listing to the wishlist.");
        }

        var exists = await _wishlistRepository.ExistsAsync(userId.Value, request.ListingId, cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Listing is already in your wishlist.");
        }

        var wishlistItem = new WishlistItem
        {
            UserId = userId.Value,
            ListingId = request.ListingId
        };

        await _wishlistRepository.AddAsync(wishlistItem, cancellationToken);
    }
}
