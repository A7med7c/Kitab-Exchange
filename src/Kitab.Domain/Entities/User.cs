using Kitab.Domain.Common;

namespace Kitab.Domain.Entities;

public class User : BaseEntity
{
    public Guid IdentityUserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
}
