using Kitab.Application.Common.Exceptions;
using Kitab.Application.Common.Interfaces;
using Kitab.Domain.Entities;
using MediatR;

namespace Kitab.Application.Wishlists.Commands.RemoveFromWishlist;

public class RemoveFromWishlistCommandHandler : IRequestHandler<RemoveFromWishlistCommand>
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly ICurrentUserService _currentUserService;

    public RemoveFromWishlistCommandHandler(
        IWishlistRepository wishlistRepository,
        ICurrentUserService currentUserService)
    {
        _wishlistRepository = wishlistRepository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(RemoveFromWishlistCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var wishlistItem = await _wishlistRepository.GetAsync(userId.Value, request.ListingId, cancellationToken);
        if (wishlistItem == null)
        {
            throw new NotFoundException($"WishlistItem {request.ListingId} not found.");
        }

        await _wishlistRepository.RemoveAsync(wishlistItem, cancellationToken);
    }
}
