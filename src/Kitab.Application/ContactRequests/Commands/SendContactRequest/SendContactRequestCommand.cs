using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;

using Kitab.Domain.Entities;

namespace Kitab.Application.ContactRequests.Commands.SendContactRequest;

public record SendContactRequestCommand(
    Guid ListingId,
    RequestType RequestType,
    Guid? OfferedListingId,
    string? Message) : IRequest<Result<ContactRequestDto>>;

public class SendContactRequestCommandValidator : AbstractValidator<SendContactRequestCommand>
{
    public SendContactRequestCommandValidator()
    {
        RuleFor(command => command.ListingId).NotEmpty();
        RuleFor(command => command.Message).MaximumLength(1000);
    }
}

public class SendContactRequestCommandHandler : IRequestHandler<SendContactRequestCommand, Result<ContactRequestDto>>
{
    private readonly IContactRequestRepository _contactRequestRepository;
    private readonly ICurrentUserService _currentUserService;

    public SendContactRequestCommandHandler(
        IContactRequestRepository contactRequestRepository,
        ICurrentUserService currentUserService)
    {
        _contactRequestRepository = contactRequestRepository;
        _currentUserService = currentUserService;
    }

    public Task<Result<ContactRequestDto>> Handle(SendContactRequestCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result<ContactRequestDto>.Failure("Authenticated user context was not found."));
        }

        return _contactRequestRepository.CreateAsync(
            userId,
            request.ListingId,
            request.RequestType,
            request.OfferedListingId,
            request.Message,
            cancellationToken);
    }
}
