using AutoMapper;
using Kitab.Application.ContactRequests.DTOs;
using Kitab.Domain.Entities;

namespace Kitab.Application.ContactRequests.Mapping;

public class ContactRequestMappingProfile : Profile
{
    public ContactRequestMappingProfile()
    {
        CreateMap<ContactRequest, ContactRequestDto>()
            .ForMember(dest => dest.ListingTitle, opt => opt.MapFrom(src => src.Listing!.Title))
            .ForMember(dest => dest.ListingAuthor, opt => opt.MapFrom(src => src.Listing!.Author))
            .ForMember(dest => dest.RequesterName, opt => opt.MapFrom(src => src.Requester!.DisplayName))
            .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner!.DisplayName))
            .ForMember(dest => dest.OfferedListingTitle, opt => opt.MapFrom(src => src.OfferedListing != null ? src.OfferedListing.Title : null));
    }
}
