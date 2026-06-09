using Kitab.Application.Common.Interfaces;
using Kitab.Application.Listings.DTOs;
using MediatR;

namespace Kitab.Application.Listings.Queries.GetAllListings;

public record GetAllListingsQuery : IRequest<IReadOnlyCollection<ListingDto>>;

public class GetAllListingsQueryHandler : IRequestHandler<GetAllListingsQuery, IReadOnlyCollection<ListingDto>>
{
    private readonly IListingRepository _listingRepository;

    public GetAllListingsQueryHandler(IListingRepository listingRepository)
    {
        _listingRepository = listingRepository;
    }

    public Task<IReadOnlyCollection<ListingDto>> Handle(GetAllListingsQuery request, CancellationToken cancellationToken)
    {
        return _listingRepository.GetAllAsync(cancellationToken);
    }
}
