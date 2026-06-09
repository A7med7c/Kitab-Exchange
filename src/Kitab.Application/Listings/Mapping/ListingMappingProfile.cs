using AutoMapper;
using Kitab.Application.Listings.DTOs;
using Kitab.Domain.Entities;

namespace Kitab.Application.Listings.Mapping;

public class ListingMappingProfile : Profile
{
    public ListingMappingProfile()
    {
        CreateMap<Listing, ListingDto>()
            .ForMember(dto => dto.ImageUrls, options => options.MapFrom(listing => listing.ImageUrls));
    }
}
