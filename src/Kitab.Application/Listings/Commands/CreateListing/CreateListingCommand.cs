using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using Kitab.Application.Listings.DTOs;
using Kitab.Domain.Entities;
using MediatR;

namespace Kitab.Application.Listings.Commands.CreateListing;

public record CreateListingCommand(
    string Title,
    string Author,
    string Category,
    ListingCondition Condition,
    string Description,
    ListingType ListingType,
    ListingStatus Status,
    decimal? Price,
    IReadOnlyList<string>? ImageUrls = null) : IRequest<Result<ListingDto>>;

public class CreateListingCommandValidator : AbstractValidator<CreateListingCommand>
{
    public CreateListingCommandValidator()
    {
        RuleFor(command => command.Title).NotEmpty().MaximumLength(200);
        RuleFor(command => command.Author).NotEmpty().MaximumLength(200);
        RuleFor(command => command.Category).NotEmpty().MaximumLength(100);
        RuleFor(command => command.Condition).IsInEnum();
        RuleFor(command => command.Description).NotEmpty().MaximumLength(2000);
        RuleFor(command => command.ListingType).IsInEnum();
        RuleFor(command => command.Status).IsInEnum();
        RuleFor(command => command.Price)
            .Must(price => price.HasValue && price.Value > 0)
            .When(command => command.ListingType == ListingType.ForSale)
            .WithMessage("Price is required for ForSale listings.");
        RuleFor(command => command.Price)
            .Null()
            .When(command => command.ListingType == ListingType.ForExchange)
            .WithMessage("Price must be empty for ForExchange listings.");
    }
}

public class CreateListingCommandHandler : IRequestHandler<CreateListingCommand, Result<ListingDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IListingRepository _listingRepository;

    public CreateListingCommandHandler(
        ICurrentUserService currentUserService,
        IListingRepository listingRepository)
    {
        _currentUserService = currentUserService;
        _listingRepository = listingRepository;
    }

    public Task<Result<ListingDto>> Handle(CreateListingCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is not { } userId)
        {
            return Task.FromResult(Result<ListingDto>.Failure("Authenticated user context was not found."));
        }

        return _listingRepository.CreateAsync(
            userId,
            request.Title,
            request.Author,
            request.Category,
            request.Condition,
            request.Description,
            request.ListingType,
            request.Status,
            request.Price,
            request.ImageUrls ?? [],
            cancellationToken);
    }
}
