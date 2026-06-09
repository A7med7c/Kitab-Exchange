using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Listings.DTOs;
using Kitab.Domain.Entities;
using MediatR;

namespace Kitab.Application.Listings.Queries.SearchListings;

public record SearchListingsQuery(
    string? Term,
    ListingCondition? Condition,
    ListingType? ListingType,
    decimal? MinPrice,
    decimal? MaxPrice) : IRequest<IReadOnlyCollection<ListingDto>>;

public class SearchListingsQueryValidator : AbstractValidator<SearchListingsQuery>
{
    public SearchListingsQueryValidator()
    {
        RuleFor(query => query.Term)
            .MaximumLength(200)
            .When(query => !string.IsNullOrWhiteSpace(query.Term));

        RuleFor(query => query.Condition)
            .IsInEnum()
            .When(query => query.Condition.HasValue);

        RuleFor(query => query.ListingType)
            .IsInEnum()
            .When(query => query.ListingType.HasValue);

        RuleFor(query => query.MinPrice)
            .GreaterThanOrEqualTo(0)
            .When(query => query.MinPrice.HasValue);

        RuleFor(query => query.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .When(query => query.MaxPrice.HasValue);

        RuleFor(query => query)
            .Must(query => !query.MinPrice.HasValue ||
                           !query.MaxPrice.HasValue ||
                           query.MinPrice.Value <= query.MaxPrice.Value)
            .WithMessage("MinPrice must be less than or equal to MaxPrice.");
    }
}

public class SearchListingsQueryHandler : IRequestHandler<SearchListingsQuery, IReadOnlyCollection<ListingDto>>
{
    private readonly IListingRepository _listingRepository;

    public SearchListingsQueryHandler(IListingRepository listingRepository)
    {
        _listingRepository = listingRepository;
    }

    public Task<IReadOnlyCollection<ListingDto>> Handle(
        SearchListingsQuery request,
        CancellationToken cancellationToken)
    {
        return _listingRepository.SearchAsync(
            request.Term,
            request.Condition,
            request.ListingType,
            request.MinPrice,
            request.MaxPrice,
            cancellationToken);
    }
}
