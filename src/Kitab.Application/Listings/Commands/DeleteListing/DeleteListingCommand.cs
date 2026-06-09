using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Listings.Commands.DeleteListing;

public record DeleteListingCommand(Guid Id) : IRequest<Result>;

public class DeleteListingCommandValidator : AbstractValidator<DeleteListingCommand>
{
    public DeleteListingCommandValidator()
    {
        RuleFor(command => command.Id).NotEmpty();
    }
}

public class DeleteListingCommandHandler : IRequestHandler<DeleteListingCommand, Result>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IListingRepository _listingRepository;

    public DeleteListingCommandHandler(
        ICurrentUserService currentUserService,
        IListingRepository listingRepository)
    {
        _currentUserService = currentUserService;
        _listingRepository = listingRepository;
    }

    public Task<Result> Handle(DeleteListingCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result.Failure("Authenticated user context was not found."));
        }

        return _listingRepository.DeleteAsync(request.Id, userId, cancellationToken);
    }
}
