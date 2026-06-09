using Microsoft.AspNetCore.Identity;

namespace Kitab.Infrastructure.Identity;

public class ApplicationRole : IdentityRole<Guid>
{
    public string? Description { get; set; }
}
