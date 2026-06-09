using Kitab.Application.Admin.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Domain.Entities;
using Kitab.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Kitab.Infrastructure.Admin;

public class AdminRepository : IAdminRepository
{
    private readonly ApplicationDbContext _dbContext;

    public AdminRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AdminDashboardDto> GetDashboardStatsAsync(CancellationToken cancellationToken)
    {
        var totalUsers = await _dbContext.DomainUsers.CountAsync(cancellationToken);
        var totalListings = await _dbContext.Listings.CountAsync(listing => !listing.IsDeleted, cancellationToken);
        var totalCategories = await _dbContext.Categories.CountAsync(category => !category.IsDeleted, cancellationToken);
        var totalRequests = await _dbContext.ContactRequests.CountAsync(cancellationToken);
        var activeListings = await _dbContext.Listings.CountAsync(
            listing => !listing.IsDeleted && listing.Status == ListingStatus.Available,
            cancellationToken);

        return new AdminDashboardDto(
            totalUsers,
            totalListings,
            totalCategories,
            totalRequests,
            activeListings);
    }
}
