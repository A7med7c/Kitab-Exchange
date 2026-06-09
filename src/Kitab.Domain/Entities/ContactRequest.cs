using Kitab.Domain.Common;

namespace Kitab.Domain.Entities;

public class ContactRequest : BaseEntity
{
    public Guid ListingId { get; set; }
    public Guid RequesterId { get; set; }
    public Guid OwnerId { get; set; }
    public ContactRequestStatus Status { get; set; } = ContactRequestStatus.Pending;
    public string? Message { get; set; }
    public RequestType RequestType { get; set; } = RequestType.Contact;
    public Guid? OfferedListingId { get; set; }

    public Listing? Listing { get; set; }
    public Listing? OfferedListing { get; set; }
    public User? Requester { get; set; }
    public User? Owner { get; set; }
}
