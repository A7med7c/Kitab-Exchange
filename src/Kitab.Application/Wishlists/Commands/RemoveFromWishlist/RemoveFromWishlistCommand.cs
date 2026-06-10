using MediatR;

namespace Kitab.Application.Wishlists.Commands.RemoveFromWishlist;

public record RemoveFromWishlistCommand(Guid ListingId) : IRequest;
