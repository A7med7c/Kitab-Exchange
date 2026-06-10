using Kitab.Application.Common.Interfaces;
using MediatR;

namespace Kitab.Application.Wishlists.Queries.IsListingWishlisted;

public class IsListingWishlistedQueryHandler : IRequestHandler<IsListingWishlistedQuery, bool>
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly ICurrentUserService _currentUserService;

    public IsListingWishlistedQueryHandler(
        IWishlistRepository wishlistRepository,
        ICurrentUserService currentUserService)
    {
        _wishlistRepository = wishlistRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(IsListingWishlistedQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            return false;
        }

        return await _wishlistRepository.ExistsAsync(userId.Value, request.ListingId, cancellationToken);
    }
}
