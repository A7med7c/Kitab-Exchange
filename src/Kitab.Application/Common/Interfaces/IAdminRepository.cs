using Kitab.Application.Admin.DTOs;

namespace Kitab.Application.Common.Interfaces;

public interface IAdminRepository
{
    Task<AdminDashboardDto> GetDashboardStatsAsync(CancellationToken cancellationToken);
}

public interface IListingImageService
{
    Task<(bool Succeeded, string? Url, string? Error)> SaveImageAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        long fileSize,
        CancellationToken cancellationToken);
}
