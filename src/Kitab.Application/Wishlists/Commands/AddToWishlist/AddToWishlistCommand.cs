using MediatR;

namespace Kitab.Application.Wishlists.Commands.AddToWishlist;

public record AddToWishlistCommand(Guid ListingId) : IRequest;
