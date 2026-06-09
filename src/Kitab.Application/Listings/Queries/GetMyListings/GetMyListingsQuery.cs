using Kitab.Application.Common.Interfaces;
using Kitab.Application.Listings.DTOs;
using MediatR;

namespace Kitab.Application.Listings.Queries.GetMyListings;

public record GetMyListingsQuery : IRequest<IReadOnlyCollection<ListingDto>>;

public class GetMyListingsQueryHandler : IRequestHandler<GetMyListingsQuery, IReadOnlyCollection<ListingDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IListingRepository _listingRepository;

    public GetMyListingsQueryHandler(
        ICurrentUserService currentUserService,
        IListingRepository listingRepository)
    {
        _currentUserService = currentUserService;
        _listingRepository = listingRepository;
    }

    public Task<IReadOnlyCollection<ListingDto>> Handle(GetMyListingsQuery request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult<IReadOnlyCollection<ListingDto>>(Array.Empty<ListingDto>());
        }

        return _listingRepository.GetMineAsync(userId, cancellationToken);
    }
}
