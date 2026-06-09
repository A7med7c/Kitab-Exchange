namespace Kitab.Application.Admin.DTOs;

public record AdminDashboardDto(
    int TotalUsers,
    int TotalListings,
    int TotalCategories,
    int TotalRequests,
    int ActiveListings);
