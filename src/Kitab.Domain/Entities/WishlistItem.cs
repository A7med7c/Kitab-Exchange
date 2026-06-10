using Kitab.Domain.Common;

namespace Kitab.Domain.Entities;

public class WishlistItem : BaseEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid ListingId { get; set; }
    public Listing? Listing { get; set; }
}
