using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Models;

namespace Kitab.Application.Common.Interfaces;

public interface IAuthenticationService
{
    Task<Result<AuthResponseDto>> RegisterAsync(
        string email,
        string password,
        string displayName,
        string? phoneNumber,
        CancellationToken cancellationToken);

    Task<Result<AuthResponseDto>> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken);

    Task<Result<AuthResponseDto>> RefreshTokenAsync(
        Guid userId,
        string refreshToken,
        CancellationToken cancellationToken);

    Task<Result<AssignRoleResponseDto>> AssignRoleAsync(
        Guid userId,
        string role,
        CancellationToken cancellationToken);

    Task<Result<CurrentUserDto>> GetUserAsync(
        Guid userId,
        CancellationToken cancellationToken);
}
