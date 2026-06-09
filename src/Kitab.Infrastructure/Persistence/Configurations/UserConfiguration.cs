using Kitab.Domain.Entities;
using Kitab.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Kitab.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.DisplayName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(user => user.PhoneNumber)
            .HasMaxLength(32);

        builder.HasIndex(user => user.IdentityUserId)
            .IsUnique();

        builder.HasOne<ApplicationUser>()
            .WithOne(identityUser => identityUser.User)
            .HasForeignKey<User>(user => user.IdentityUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
