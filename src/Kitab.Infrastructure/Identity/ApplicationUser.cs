using Kitab.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Kitab.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public User? User { get; set; }
}
