using AutoMapper;
using Kitab.Application.ContactRequests.DTOs;
using Kitab.Application.ContactRequests.Mapping;
using Kitab.Application.Listings.DTOs;
using Kitab.Application.Listings.Mapping;
using Kitab.Domain.Entities;
using Xunit;

namespace Kitab.API.Tests;

public class AutoMapperConfigurationTests
{
    [Fact]
    public void ListingMappingProfile_IsValid()
    {
        var configuration = new MapperConfiguration(config =>
        {
            config.AddProfile<ContactRequestMappingProfile>();
            config.AddProfile<ListingMappingProfile>();
        });

        configuration.AssertConfigurationIsValid();
    }

    [Fact]
    public void ListingMappingProfile_MapsListingToDto()
    {
        var mapper = new MapperConfiguration(config =>
        {
            config.AddProfile<ListingMappingProfile>();
        }).CreateMapper();

        var listing = new Listing
        {
            Id = Guid.NewGuid(),
            OwnerId = Guid.NewGuid(),
            Title = "Clean Code",
            Author = "Robert C. Martin",
            Category = "Programming",
            Condition = ListingCondition.Good,
            Description = "A used copy in good condition.",
            ListingType = ListingType.ForSale,
            Status = ListingStatus.Available,
            Price = 250,
            CreatedAt = DateTimeOffset.UtcNow
        };

        var dto = mapper.Map<ListingDto>(listing);

        Assert.Equal(listing.Id, dto.Id);
        Assert.Equal(listing.Title, dto.Title);
        Assert.Equal(listing.Author, dto.Author);
        Assert.Equal(listing.Category, dto.Category);
        Assert.Equal(listing.Condition, dto.Condition);
        Assert.Equal(listing.ListingType, dto.ListingType);
        Assert.Equal(listing.Status, dto.Status);
        Assert.Equal(listing.Price, dto.Price);
    }

    [Fact]
    public void ContactRequestMappingProfile_MapsContactRequestToDto()
    {
        var mapper = new MapperConfiguration(config =>
        {
            config.AddProfile<ContactRequestMappingProfile>();
        }).CreateMapper();

        var contactRequest = new ContactRequest
        {
            Id = Guid.NewGuid(),
            ListingId = Guid.NewGuid(),
            RequesterId = Guid.NewGuid(),
            OwnerId = Guid.NewGuid(),
            Status = ContactRequestStatus.Pending,
            Message = "I am interested in this book.",
            CreatedAt = DateTimeOffset.UtcNow
        };

        var dto = mapper.Map<ContactRequestDto>(contactRequest);

        Assert.Equal(contactRequest.Id, dto.Id);
        Assert.Equal(contactRequest.ListingId, dto.ListingId);
        Assert.Equal(contactRequest.RequesterId, dto.RequesterId);
        Assert.Equal(contactRequest.OwnerId, dto.OwnerId);
        Assert.Equal(contactRequest.Status, dto.Status);
        Assert.Equal(contactRequest.Message, dto.Message);
    }
}
