using Kitab.Domain.Common;

namespace Kitab.Domain.Entities;

public class Listing : BaseEntity
{
    public Guid OwnerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public ListingCondition Condition { get; set; }
    public string Description { get; set; } = string.Empty;
    public ListingType ListingType { get; set; }
    public ListingStatus Status { get; set; } = ListingStatus.Available;
    public decimal? Price { get; set; }
    public List<string> ImageUrls { get; set; } = [];
    public bool IsDeleted { get; set; }
    public User? Owner { get; set; }
}
