using Kitab.Application.Auth.Commands.AssignRole;
using Kitab.Application.Auth.Commands.Login;
using Kitab.Application.Auth.Commands.RefreshToken;
using Kitab.Application.Auth.Commands.Register;
using Xunit;

namespace Kitab.API.Tests;

public class AuthValidatorTests
{
    [Fact]
    public void RegisterCommandValidator_AcceptsValidRegistration()
    {
        var validator = new RegisterCommandValidator();
        var result = validator.Validate(new RegisterCommand(
            "reader@example.com",
            "Passw0rd!",
            "Ahmed Reader",
            "+201001112223"));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void RegisterCommandValidator_RejectsWeakRegistration()
    {
        var validator = new RegisterCommandValidator();
        var result = validator.Validate(new RegisterCommand(
            "not-an-email",
            "short",
            string.Empty,
            new string('1', 33)));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Email");
        Assert.Contains(result.Errors, error => error.PropertyName == "Password");
        Assert.Contains(result.Errors, error => error.PropertyName == "DisplayName");
        Assert.Contains(result.Errors, error => error.PropertyName == "PhoneNumber");
    }

    [Fact]
    public void LoginCommandValidator_RejectsMissingCredentials()
    {
        var validator = new LoginCommandValidator();
        var result = validator.Validate(new LoginCommand(string.Empty, string.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Email");
        Assert.Contains(result.Errors, error => error.PropertyName == "Password");
    }

    [Fact]
    public void AssignRoleCommandValidator_AllowsOnlySupportedRoles()
    {
        var validator = new AssignRoleCommandValidator();

        Assert.True(validator.Validate(new AssignRoleCommand(Guid.NewGuid(), "Admin")).IsValid);
        Assert.True(validator.Validate(new AssignRoleCommand(Guid.NewGuid(), "User")).IsValid);
        Assert.False(validator.Validate(new AssignRoleCommand(Guid.NewGuid(), "Owner")).IsValid);
    }

    [Fact]
    public void RefreshTokenCommandValidator_RequiresUserIdAndRefreshToken()
    {
        var validator = new RefreshTokenCommandValidator();

        Assert.True(validator.Validate(new RefreshTokenCommand(Guid.NewGuid(), "refresh-token")).IsValid);
        Assert.False(validator.Validate(new RefreshTokenCommand(Guid.Empty, string.Empty)).IsValid);
    }
}
