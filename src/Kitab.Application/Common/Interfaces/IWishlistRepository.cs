using Kitab.Domain.Entities;

namespace Kitab.Application.Common.Interfaces;

public interface IWishlistRepository
{
    Task<WishlistItem?> GetAsync(Guid userId, Guid listingId, CancellationToken cancellationToken);
    Task<List<Listing>> GetMyWishlistAsync(Guid userId, CancellationToken cancellationToken);
    Task AddAsync(WishlistItem item, CancellationToken cancellationToken);
    Task RemoveAsync(WishlistItem item, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(Guid userId, Guid listingId, CancellationToken cancellationToken);
}
