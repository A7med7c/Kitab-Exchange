namespace Kitab.Application.Auth.DTOs;

public record AuthResponseDto(
    Guid UserId,
    string Email,
    string DisplayName,
    IReadOnlyCollection<string> Roles,
    string AccessToken,
    DateTimeOffset ExpiresAt,
    string? RefreshToken);

public record AssignRoleResponseDto(
    Guid UserId,
    string Role);

public record CurrentUserDto(
    Guid UserId,
    string Email,
    string DisplayName,
    IReadOnlyCollection<string> Roles);
