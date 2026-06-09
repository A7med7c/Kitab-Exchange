namespace Kitab.Application.Categories.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string? Description,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);
