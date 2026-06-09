using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Listings.Commands.AdminDeleteListing;

public record AdminDeleteListingCommand(Guid Id) : IRequest<Result>;

public class AdminDeleteListingCommandHandler : IRequestHandler<AdminDeleteListingCommand, Result>
{
    private readonly IListingRepository _listingRepository;

    public AdminDeleteListingCommandHandler(IListingRepository listingRepository)
    {
        _listingRepository = listingRepository;
    }

    public Task<Result> Handle(AdminDeleteListingCommand request, CancellationToken cancellationToken)
    {
        return _listingRepository.AdminDeleteAsync(request.Id, cancellationToken);
    }
}
