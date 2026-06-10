using AutoMapper;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Listings.DTOs;
using MediatR;

namespace Kitab.Application.Wishlists.Queries.GetMyWishlist;

public class GetMyWishlistQueryHandler : IRequestHandler<GetMyWishlistQuery, List<ListingDto>>
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public GetMyWishlistQueryHandler(
        IWishlistRepository wishlistRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _wishlistRepository = wishlistRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<List<ListingDto>> Handle(GetMyWishlistQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var listings = await _wishlistRepository.GetMyWishlistAsync(userId.Value, cancellationToken);
        return _mapper.Map<List<ListingDto>>(listings);
    }
}
