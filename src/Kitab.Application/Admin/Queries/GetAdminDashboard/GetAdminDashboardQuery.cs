using Kitab.Application.Admin.DTOs;
using Kitab.Application.Common.Interfaces;
using MediatR;

namespace Kitab.Application.Admin.Queries.GetAdminDashboard;

public record GetAdminDashboardQuery : IRequest<AdminDashboardDto>;

public class GetAdminDashboardQueryHandler : IRequestHandler<GetAdminDashboardQuery, AdminDashboardDto>
{
    private readonly IAdminRepository _adminRepository;

    public GetAdminDashboardQueryHandler(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public Task<AdminDashboardDto> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
    {
        return _adminRepository.GetDashboardStatsAsync(cancellationToken);
    }
}
