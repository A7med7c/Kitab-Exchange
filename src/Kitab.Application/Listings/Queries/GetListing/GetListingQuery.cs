using Kitab.Application.Common.Interfaces;
using Kitab.Application.Listings.DTOs;
using MediatR;

namespace Kitab.Application.Listings.Queries.GetListing;

public record GetListingQuery(Guid Id) : IRequest<ListingDto?>;

public class GetListingQueryHandler : IRequestHandler<GetListingQuery, ListingDto?>
{
    private readonly IListingRepository _listingRepository;

    public GetListingQueryHandler(IListingRepository listingRepository)
    {
        _listingRepository = listingRepository;
    }

    public Task<ListingDto?> Handle(GetListingQuery request, CancellationToken cancellationToken)
    {
        return _listingRepository.GetByIdAsync(request.Id, cancellationToken);
    }
}
