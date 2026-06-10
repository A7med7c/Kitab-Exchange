using Kitab.Application.Listings.DTOs;
using MediatR;

namespace Kitab.Application.Wishlists.Queries.GetMyWishlist;

public record GetMyWishlistQuery : IRequest<List<ListingDto>>;
