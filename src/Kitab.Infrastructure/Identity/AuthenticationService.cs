using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Kitab.Infrastructure.Identity;

public class AuthenticationService : IAuthenticationService
{
    private const string DefaultRole = "User";
    private const string RefreshTokenProvider = "Kitab";
    private const string RefreshTokenName = "RefreshToken";

    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly JwtOptions _jwtOptions;

    public AuthenticationService(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IOptions<JwtOptions> jwtOptions)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(
        string email,
        string password,
        string displayName,
        string? phoneNumber,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim();
        if (await _userManager.FindByEmailAsync(normalizedEmail) is not null)
        {
            return Result<AuthResponseDto>.Failure("An account with this email already exists.");
        }

        var identityUser = new ApplicationUser
        {
            UserName = normalizedEmail,
            Email = normalizedEmail,
            PhoneNumber = phoneNumber
        };

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var createResult = await _userManager.CreateAsync(identityUser, password);
        if (!createResult.Succeeded)
        {
            return Result<AuthResponseDto>.Failure(BuildIdentityError(createResult));
        }

        var domainUser = new User
        {
            IdentityUserId = identityUser.Id,
            DisplayName = displayName.Trim(),
            PhoneNumber = phoneNumber,
            CreatedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };

        _dbContext.DomainUsers.Add(domainUser);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var roleResult = await EnsureRoleAndAddAsync(identityUser, DefaultRole);
        if (!roleResult.Succeeded)
        {
            return Result<AuthResponseDto>.Failure(roleResult.Error ?? "Could not assign the default role.");
        }

        await transaction.CommitAsync(cancellationToken);

        return Result<AuthResponseDto>.Success(await BuildAuthResponseAsync(identityUser, cancellationToken));
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken)
    {
        var identityUser = await _userManager.FindByEmailAsync(email.Trim());
        if (identityUser is null || !await _userManager.CheckPasswordAsync(identityUser, password))
        {
            return Result<AuthResponseDto>.Failure("Invalid email or password.");
        }

        var domainUser = await _dbContext.DomainUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(user => user.IdentityUserId == identityUser.Id, cancellationToken);

        if (domainUser is not { IsActive: true })
        {
            return Result<AuthResponseDto>.Failure("User account is inactive.");
        }

        return Result<AuthResponseDto>.Success(await BuildAuthResponseAsync(identityUser, cancellationToken));
    }

    public async Task<Result<AuthResponseDto>> RefreshTokenAsync(
        Guid userId,
        string refreshToken,
        CancellationToken cancellationToken)
    {
        var identityUser = await _userManager.FindByIdAsync(userId.ToString());
        if (identityUser is null)
        {
            return Result<AuthResponseDto>.Failure("Invalid refresh token.");
        }

        var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(
            identityUser,
            RefreshTokenProvider,
            RefreshTokenName);

        if (storedRefreshToken is null ||
            !CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(storedRefreshToken),
                Encoding.UTF8.GetBytes(refreshToken)))
        {
            return Result<AuthResponseDto>.Failure("Invalid refresh token.");
        }

        var domainUser = await _dbContext.DomainUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(user => user.IdentityUserId == identityUser.Id, cancellationToken);

        if (domainUser is not { IsActive: true })
        {
            return Result<AuthResponseDto>.Failure("User account is inactive.");
        }

        return Result<AuthResponseDto>.Success(await BuildAuthResponseAsync(identityUser, cancellationToken));
    }

    public async Task<Result<AssignRoleResponseDto>> AssignRoleAsync(
        Guid userId,
        string role,
        CancellationToken cancellationToken)
    {
        var identityUser = await _userManager.FindByIdAsync(userId.ToString());
        if (identityUser is null)
        {
            return Result<AssignRoleResponseDto>.Failure("User was not found.");
        }

        if (!TryNormalizeRole(role, out var normalizedRole))
        {
            return Result<AssignRoleResponseDto>.Failure("Role must be either User or Admin.");
        }

        var roleResult = await EnsureRoleAndAddAsync(identityUser, normalizedRole);
        if (!roleResult.Succeeded)
        {
            return Result<AssignRoleResponseDto>.Failure(roleResult.Error ?? "Could not assign role.");
        }

        return Result<AssignRoleResponseDto>.Success(new AssignRoleResponseDto(identityUser.Id, normalizedRole));
    }

    public async Task<Result<CurrentUserDto>> GetUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var identityUser = await _userManager.FindByIdAsync(userId.ToString());
        if (identityUser is null)
        {
            return Result<CurrentUserDto>.Failure("User was not found.");
        }

        var domainUser = await _dbContext.DomainUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(user => user.IdentityUserId == userId, cancellationToken);

        if (domainUser is null)
        {
            return Result<CurrentUserDto>.Failure("User profile was not found.");
        }

        var roles = await _userManager.GetRolesAsync(identityUser);
        return Result<CurrentUserDto>.Success(new CurrentUserDto(
            identityUser.Id,
            identityUser.Email ?? string.Empty,
            domainUser.DisplayName,
            roles.ToArray()));
    }

    private async Task<Result> EnsureRoleAndAddAsync(ApplicationUser identityUser, string role)
    {
        if (!await _roleManager.RoleExistsAsync(role))
        {
            var createRoleResult = await _roleManager.CreateAsync(new ApplicationRole
            {
                Name = role,
                Description = $"{role} role"
            });

            if (!createRoleResult.Succeeded)
            {
                return Result.Failure(BuildIdentityError(createRoleResult));
            }
        }

        if (await _userManager.IsInRoleAsync(identityUser, role))
        {
            return Result.Success();
        }

        var addRoleResult = await _userManager.AddToRoleAsync(identityUser, role);
        return addRoleResult.Succeeded
            ? Result.Success()
            : Result.Failure(BuildIdentityError(addRoleResult));
    }

    private async Task<AuthResponseDto> BuildAuthResponseAsync(
        ApplicationUser identityUser,
        CancellationToken cancellationToken)
    {
        var domainUser = await _dbContext.DomainUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(user => user.IdentityUserId == identityUser.Id, cancellationToken);

        var roles = await _userManager.GetRolesAsync(identityUser);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.ExpirationMinutes);

        var refreshToken = GenerateRefreshToken();
        await _userManager.SetAuthenticationTokenAsync(
            identityUser,
            RefreshTokenProvider,
            RefreshTokenName,
            refreshToken);

        return new AuthResponseDto(
            identityUser.Id,
            identityUser.Email ?? string.Empty,
            domainUser?.DisplayName ?? identityUser.Email ?? string.Empty,
            roles.ToArray(),
            GenerateAccessToken(identityUser, domainUser?.DisplayName, roles, expiresAt),
            expiresAt,
            refreshToken);
    }

    private string GenerateAccessToken(
        ApplicationUser identityUser,
        string? displayName,
        IEnumerable<string> roles,
        DateTimeOffset expiresAt)
    {
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SigningKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, identityUser.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, identityUser.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, identityUser.Id.ToString()),
            new(ClaimTypes.Name, displayName ?? identityUser.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private static bool TryNormalizeRole(string role, out string normalizedRole)
    {
        if (string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase))
        {
            normalizedRole = "Admin";
            return true;
        }

        if (string.Equals(role, "user", StringComparison.OrdinalIgnoreCase))
        {
            normalizedRole = "User";
            return true;
        }

        normalizedRole = string.Empty;
        return false;
    }

    private static string BuildIdentityError(IdentityResult result)
    {
        return string.Join(" ", result.Errors.Select(error => error.Description));
    }
}
