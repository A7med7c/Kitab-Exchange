using Kitab.Application.Common.Interfaces;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kitab.Infrastructure.Wishlists;

public class WishlistRepository : IWishlistRepository
{
    private readonly ApplicationDbContext _context;

    public WishlistRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WishlistItem?> GetAsync(Guid userId, Guid listingId, CancellationToken cancellationToken)
    {
        return await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ListingId == listingId, cancellationToken);
    }

    public async Task<List<Listing>> GetMyWishlistAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _context.WishlistItems
            .Where(w => w.UserId == userId)
            .Include(w => w.Listing)
            .Select(w => w.Listing!)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(WishlistItem item, CancellationToken cancellationToken)
    {
        _context.WishlistItems.Add(item);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(WishlistItem item, CancellationToken cancellationToken)
    {
        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid listingId, CancellationToken cancellationToken)
    {
        return await _context.WishlistItems
            .AnyAsync(w => w.UserId == userId && w.ListingId == listingId, cancellationToken);
    }
}
