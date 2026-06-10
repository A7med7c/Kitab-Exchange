using MediatR;

namespace Kitab.Application.Wishlists.Queries.IsListingWishlisted;

public record IsListingWishlistedQuery(Guid ListingId) : IRequest<bool>;
