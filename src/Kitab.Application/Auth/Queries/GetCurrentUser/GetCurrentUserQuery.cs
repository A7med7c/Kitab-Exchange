using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Auth.Queries.GetCurrentUser;

public record GetCurrentUserQuery : IRequest<Result<CurrentUserDto>>;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, Result<CurrentUserDto>>
{
    private readonly IAuthenticationService _authenticationService;
    private readonly ICurrentUserService _currentUserService;

    public GetCurrentUserQueryHandler(
        IAuthenticationService authenticationService,
        ICurrentUserService currentUserService)
    {
        _authenticationService = authenticationService;
        _currentUserService = currentUserService;
    }

    public Task<Result<CurrentUserDto>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result<CurrentUserDto>.Failure("Authenticated user context was not found."));
        }

        return _authenticationService.GetUserAsync(userId, cancellationToken);
    }
}
