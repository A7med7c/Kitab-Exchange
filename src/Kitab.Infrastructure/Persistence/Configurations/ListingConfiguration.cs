using Kitab.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Kitab.Infrastructure.Persistence.Configurations;

public class ListingConfiguration : IEntityTypeConfiguration<Listing>
{
    public void Configure(EntityTypeBuilder<Listing> builder)
    {
        builder.ToTable("Listings");

        builder.HasKey(listing => listing.Id);

        builder.Property(listing => listing.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(listing => listing.Author)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(listing => listing.Category)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(listing => listing.Condition)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(listing => listing.Description)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(listing => listing.ListingType)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(listing => listing.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(listing => listing.Price)
            .HasColumnType("decimal(10,2)");

        builder.Property(listing => listing.ImageUrls)
            .HasConversion(
                urls => System.Text.Json.JsonSerializer.Serialize(urls, (System.Text.Json.JsonSerializerOptions?)null),
                json => System.Text.Json.JsonSerializer.Deserialize<List<string>>(json, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>())
            .HasColumnType("nvarchar(max)")
            .Metadata.SetValueComparer(new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<List<string>>(
                (left, right) => (left ?? new List<string>()).SequenceEqual(right ?? new List<string>()),
                value => value.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
                value => value.ToList()));

        builder.HasIndex(listing => new { listing.Status, listing.CreatedAt });
        builder.HasIndex(listing => listing.Category);
        builder.HasIndex(listing => listing.OwnerId);

        builder.HasOne(listing => listing.Owner)
            .WithMany()
            .HasForeignKey(listing => listing.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
