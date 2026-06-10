using AutoMapper;
using Kitab.Application.ContactRequests.DTOs;
using Kitab.Domain.Entities;

namespace Kitab.Application.ContactRequests.Mapping;

public class ContactRequestMappingProfile : Profile
{
    public ContactRequestMappingProfile()
    {
        CreateMap<ContactRequest, ContactRequestDto>()
            .ForCtorParam("ListingTitle", opt => opt.MapFrom(src => src.Listing!.Title))
            .ForCtorParam("ListingAuthor", opt => opt.MapFrom(src => src.Listing!.Author))
            .ForCtorParam("RequesterName", opt => opt.MapFrom(src => src.Requester!.DisplayName))
            .ForCtorParam("OwnerName", opt => opt.MapFrom(src => src.Owner!.DisplayName))
            .ForCtorParam("OfferedListingTitle", opt => opt.MapFrom(src => src.OfferedListing != null ? src.OfferedListing.Title : null));
    }
}
