using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;

namespace Kitab.Application.ContactRequests.Commands.RejectContactRequest;

public record RejectContactRequestCommand(Guid Id) : IRequest<Result<ContactRequestDto>>;

public class RejectContactRequestCommandValidator : AbstractValidator<RejectContactRequestCommand>
{
    public RejectContactRequestCommandValidator()
    {
        RuleFor(command => command.Id).NotEmpty();
    }
}

public class RejectContactRequestCommandHandler : IRequestHandler<RejectContactRequestCommand, Result<ContactRequestDto>>
{
    private readonly IContactRequestRepository _contactRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public RejectContactRequestCommandHandler(
        IContactRequestRepository contactRequestRepository,
        ICurrentUserService currentUserService)
    {
        _contactRequestRepository = contactRequestRepository;
        _currentUserService = currentUserService;
    }

    public Task<Result<ContactRequestDto>> Handle(RejectContactRequestCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result<ContactRequestDto>.Failure("Authenticated user context was not found."));
        }

        return _contactRequestRepository.RejectAsync(request.Id, userId, cancellationToken);
    }
}
