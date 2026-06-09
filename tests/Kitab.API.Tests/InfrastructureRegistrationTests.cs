using Kitab.Infrastructure;
using Kitab.Infrastructure.Identity;
using Kitab.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit;

namespace Kitab.API.Tests;

public class InfrastructureRegistrationTests
{
    [Fact]
    public void AddInfrastructure_RegistersPersistenceIdentityAndJwtServices()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=localhost,1433;Database=KitabTestDb;User Id=sa;Password=Kitab@12345;TrustServerCertificate=True",
                ["Jwt:Issuer"] = "Kitab.Tests",
                ["Jwt:Audience"] = "Kitab.Tests.Client",
                ["Jwt:SigningKey"] = "Kitab test signing key with enough length.",
                ["Jwt:ExpirationMinutes"] = "30"
            })
            .Build();

        services.AddInfrastructure(configuration);

        using var provider = services.BuildServiceProvider();

        Assert.NotNull(provider.GetRequiredService<ApplicationDbContext>());
        Assert.NotNull(provider.GetRequiredService<UserManager<ApplicationUser>>());
        Assert.NotNull(provider.GetRequiredService<RoleManager<ApplicationRole>>());

        var dbOptions = provider.GetRequiredService<DbContextOptions<ApplicationDbContext>>();
        Assert.Contains(dbOptions.Extensions, extension => extension.GetType().Name.Contains("SqlServer"));

        var authOptions = provider.GetRequiredService<IOptions<Microsoft.AspNetCore.Authentication.AuthenticationOptions>>().Value;
        Assert.Equal(JwtBearerDefaults.AuthenticationScheme, authOptions.DefaultScheme);
    }
}
