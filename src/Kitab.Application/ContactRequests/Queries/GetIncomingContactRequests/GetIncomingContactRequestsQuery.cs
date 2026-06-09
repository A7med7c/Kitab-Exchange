using Kitab.Application.Common.Interfaces;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;

namespace Kitab.Application.ContactRequests.Queries.GetIncomingContactRequests;

public record GetIncomingContactRequestsQuery : IRequest<IReadOnlyCollection<ContactRequestDto>>;

public class GetIncomingContactRequestsQueryHandler
    : IRequestHandler<GetIncomingContactRequestsQuery, IReadOnlyCollection<ContactRequestDto>>
{
    private readonly IContactRequestRepository _contactRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetIncomingContactRequestsQueryHandler(
        IContactRequestRepository contactRequestRepository,
        ICurrentUserService currentUserService)
    {
        _contactRequestRepository = contactRequestRepository;
        _currentUserService = currentUserService;
    }

    public Task<IReadOnlyCollection<ContactRequestDto>> Handle(
        GetIncomingContactRequestsQuery request,
        CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult<IReadOnlyCollection<ContactRequestDto>>(Array.Empty<ContactRequestDto>());
        }

        return _contactRequestRepository.GetIncomingAsync(userId, cancellationToken);
    }
}
