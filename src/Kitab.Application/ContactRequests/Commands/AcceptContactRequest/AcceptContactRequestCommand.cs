using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;

namespace Kitab.Application.ContactRequests.Commands.AcceptContactRequest;

public record AcceptContactRequestCommand(Guid Id) : IRequest<Result<ContactRequestDto>>;

public class AcceptContactRequestCommandValidator : AbstractValidator<AcceptContactRequestCommand>
{
    public AcceptContactRequestCommandValidator()
    {
        RuleFor(command => command.Id).NotEmpty();
    }
}

public class AcceptContactRequestCommandHandler : IRequestHandler<AcceptContactRequestCommand, Result<ContactRequestDto>>
{
    private readonly IContactRequestRepository _contactRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public AcceptContactRequestCommandHandler(
        IContactRequestRepository contactRequestRepository,
        ICurrentUserService currentUserService)
    {
        _contactRequestRepository = contactRequestRepository;
        _currentUserService = currentUserService;
    }

    public Task<Result<ContactRequestDto>> Handle(AcceptContactRequestCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result<ContactRequestDto>.Failure("Authenticated user context was not found."));
        }

        return _contactRequestRepository.AcceptAsync(request.Id, userId, cancellationToken);
    }
}
