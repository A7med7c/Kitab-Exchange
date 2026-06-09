using Kitab.Domain.Entities;
using Kitab.Infrastructure.Identity;
using Kitab.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Kitab.Infrastructure.Persistence;

public static class DataSeeder
{
    private static readonly string[] Roles = ["Admin", "User"];

    private static readonly string[] CategoryNames =
    [
        "Fiction",
        "Non Fiction",
        "Science",
        "Technology",
        "Programming",
        "Computer Science",
        "Business",
        "Economics",
        "History",
        "Philosophy",
        "Religion",
        "Education",
        "Self Development",
        "Novels",
        "Children",
        "Engineering",
        "Medicine",
        "Languages"
    ];

    private const string AdminEmail = "admin@kitab.com";
    private const string AdminPassword = "Admin@123";
    private const string AdminDisplayName = "Kitab Admin";

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DataSeeder");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        await dbContext.Database.MigrateAsync();

        await SeedRolesAsync(roleManager, logger);
        await SeedCategoriesAsync(dbContext, logger);
        await SeedAdminUserAsync(dbContext, userManager, logger);
    }

    private static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager, ILogger logger)
    {
        foreach (var roleName in Roles)
        {
            if (await roleManager.RoleExistsAsync(roleName))
            {
                continue;
            }

            var result = await roleManager.CreateAsync(new ApplicationRole
            {
                Name = roleName,
                Description = $"{roleName} role"
            });

            if (result.Succeeded)
            {
                logger.LogInformation("Seeded role {Role}", roleName);
            }
            else
            {
                logger.LogWarning("Failed to seed role {Role}: {Errors}", roleName, string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        var existingNames = await dbContext.Categories
            .Where(category => !category.IsDeleted)
            .Select(category => category.Name)
            .ToListAsync();

        var created = 0;
        foreach (var name in CategoryNames)
        {
            if (existingNames.Contains(name))
            {
                continue;
            }

            dbContext.Categories.Add(new Category
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = $"{name} books",
                CreatedAt = DateTimeOffset.UtcNow
            });
            created++;
        }

        if (created > 0)
        {
            await dbContext.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} categories", created);
        }
    }

    private static async Task SeedAdminUserAsync(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        ILogger logger)
    {
        var existingAdmin = await userManager.FindByEmailAsync(AdminEmail);
        if (existingAdmin is not null)
        {
            if (!await userManager.IsInRoleAsync(existingAdmin, "Admin"))
            {
                await userManager.AddToRoleAsync(existingAdmin, "Admin");
            }

            return;
        }

        var identityUser = new ApplicationUser
        {
            UserName = AdminEmail,
            Email = AdminEmail,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(identityUser, AdminPassword);
        if (!createResult.Succeeded)
        {
            logger.LogWarning("Failed to seed admin user: {Errors}", string.Join(", ", createResult.Errors.Select(e => e.Description)));
            return;
        }

        var domainUser = new User
        {
            IdentityUserId = identityUser.Id,
            DisplayName = AdminDisplayName,
            CreatedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };

        dbContext.DomainUsers.Add(domainUser);
        await dbContext.SaveChangesAsync();
        await userManager.AddToRoleAsync(identityUser, "Admin");

        logger.LogInformation("Seeded admin user {Email}", AdminEmail);
    }
}
