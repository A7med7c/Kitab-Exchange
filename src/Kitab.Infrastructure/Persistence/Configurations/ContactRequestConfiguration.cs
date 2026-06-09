using Kitab.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Kitab.Infrastructure.Persistence.Configurations;

public class ContactRequestConfiguration : IEntityTypeConfiguration<ContactRequest>
{
    public void Configure(EntityTypeBuilder<ContactRequest> builder)
    {
        builder.ToTable("ContactRequests");

        builder.HasKey(contactRequest => contactRequest.Id);

        builder.Property(contactRequest => contactRequest.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(contactRequest => contactRequest.Message)
            .HasMaxLength(1000);

        builder.HasIndex(contactRequest => new { contactRequest.ListingId, contactRequest.RequesterId });
        builder.HasIndex(contactRequest => new { contactRequest.OwnerId, contactRequest.Status });
        builder.HasIndex(contactRequest => contactRequest.RequesterId);

        builder.HasOne(contactRequest => contactRequest.Listing)
            .WithMany()
            .HasForeignKey(contactRequest => contactRequest.ListingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(contactRequest => contactRequest.Requester)
            .WithMany()
            .HasForeignKey(contactRequest => contactRequest.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(contactRequest => contactRequest.Owner)
            .WithMany()
            .HasForeignKey(contactRequest => contactRequest.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(contactRequest => contactRequest.RequestType)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.HasOne(contactRequest => contactRequest.OfferedListing)
            .WithMany()
            .HasForeignKey(contactRequest => contactRequest.OfferedListingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
