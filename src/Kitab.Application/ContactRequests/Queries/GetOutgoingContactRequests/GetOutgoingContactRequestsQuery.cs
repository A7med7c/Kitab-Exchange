using Kitab.Application.Common.Interfaces;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;

namespace Kitab.Application.ContactRequests.Queries.GetOutgoingContactRequests;

public record GetOutgoingContactRequestsQuery : IRequest<IReadOnlyCollection<ContactRequestDto>>;

public class GetOutgoingContactRequestsQueryHandler
    : IRequestHandler<GetOutgoingContactRequestsQuery, IReadOnlyCollection<ContactRequestDto>>
{
    private readonly IContactRequestRepository _contactRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetOutgoingContactRequestsQueryHandler(
        IContactRequestRepository contactRequestRepository,
        ICurrentUserService currentUserService)
    {
        _contactRequestRepository = contactRequestRepository;
        _currentUserService = currentUserService;
    }

    public Task<IReadOnlyCollection<ContactRequestDto>> Handle(
        GetOutgoingContactRequestsQuery request,
        CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult<IReadOnlyCollection<ContactRequestDto>>(Array.Empty<ContactRequestDto>());
        }

        return _contactRequestRepository.GetOutgoingAsync(userId, cancellationToken);
    }
}
