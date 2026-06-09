using Kitab.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace Kitab.Infrastructure.Listings;

public class ListingImageService : IListingImageService
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    };

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private readonly IWebHostEnvironment _environment;

    public ListingImageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<(bool Succeeded, string? Url, string? Error)> SaveImageAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        long fileSize,
        CancellationToken cancellationToken)
    {
        if (fileSize <= 0)
        {
            return (false, null, "Image file is empty.");
        }

        if (fileSize > MaxFileSizeBytes)
        {
            return (false, null, "Image file must be 5 MB or smaller.");
        }

        if (!AllowedContentTypes.Contains(contentType))
        {
            return (false, null, "Only JPG, JPEG, PNG, and WEBP images are allowed.");
        }

        var extension = Path.GetExtension(fileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
        {
            return (false, null, "Only JPG, JPEG, PNG, and WEBP images are allowed.");
        }

        var uploadsDirectory = Path.Combine(_environment.WebRootPath, "uploads", "listings");
        Directory.CreateDirectory(uploadsDirectory);

        var uniqueFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsDirectory, uniqueFileName);

        await using var output = File.Create(filePath);
        await fileStream.CopyToAsync(output, cancellationToken);

        return (true, $"/uploads/listings/{uniqueFileName}", null);
    }
}
