using Kitab.Application.Listings.Commands.CreateListing;
using Kitab.Application.Listings.Commands.UpdateListing;
using Kitab.Application.Listings.Queries.SearchListings;
using Kitab.Domain.Entities;
using Xunit;

namespace Kitab.API.Tests;

public class ListingValidatorTests
{
    [Fact]
    public void CreateListingCommandValidator_AcceptsForSaleListingWithPrice()
    {
        var validator = new CreateListingCommandValidator();
        var result = validator.Validate(new CreateListingCommand(
            "Clean Code",
            "Robert C. Martin",
            "Programming",
            ListingCondition.Good,
            "A used copy in good condition.",
            ListingType.ForSale,
            ListingStatus.Available,
            250));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void CreateListingCommandValidator_RejectsForSaleListingWithoutPrice()
    {
        var validator = new CreateListingCommandValidator();
        var result = validator.Validate(new CreateListingCommand(
            "Clean Code",
            "Robert C. Martin",
            "Programming",
            ListingCondition.Good,
            "A used copy in good condition.",
            ListingType.ForSale,
            ListingStatus.Available,
            null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Price");
    }

    [Fact]
    public void UpdateListingCommandValidator_RejectsExchangeListingWithPrice()
    {
        var validator = new UpdateListingCommandValidator();
        var result = validator.Validate(new UpdateListingCommand(
            Guid.NewGuid(),
            "Dune",
            "Frank Herbert",
            "Science Fiction",
            ListingCondition.Acceptable,
            "Open to exchange.",
            ListingType.ForExchange,
            ListingStatus.Available,
            100));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Price");
    }

    [Fact]
    public void SearchListingsQueryValidator_AcceptsValidFilters()
    {
        var validator = new SearchListingsQueryValidator();
        var result = validator.Validate(new SearchListingsQuery(
            "clean",
            ListingCondition.Good,
            ListingType.ForSale,
            100,
            500));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void SearchListingsQueryValidator_RejectsInvalidPriceRange()
    {
        var validator = new SearchListingsQueryValidator();
        var result = validator.Validate(new SearchListingsQuery(
            null,
            null,
            null,
            500,
            100));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.ErrorMessage == "MinPrice must be less than or equal to MaxPrice.");
    }

    [Fact]
    public void SearchListingsQueryValidator_RejectsNegativePrices()
    {
        var validator = new SearchListingsQueryValidator();
        var result = validator.Validate(new SearchListingsQuery(
            null,
            null,
            null,
            -1,
            -1));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "MinPrice");
        Assert.Contains(result.Errors, error => error.PropertyName == "MaxPrice");
    }
}
