using Kitab.Application.Listings.DTOs;
using Kitab.Application.Wishlists.Commands.AddToWishlist;
using Kitab.Application.Wishlists.Commands.RemoveFromWishlist;
using Kitab.Application.Wishlists.Queries.GetMyWishlist;
using Kitab.Application.Wishlists.Queries.IsListingWishlisted;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WishlistController : ControllerBase
{
    private readonly IMediator _mediator;

    public WishlistController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{listingId}")]
    public async Task<IActionResult> AddToWishlist(Guid listingId)
    {
        await _mediator.Send(new AddToWishlistCommand(listingId));
        return Ok();
    }

    [HttpDelete("{listingId}")]
    public async Task<IActionResult> RemoveFromWishlist(Guid listingId)
    {
        await _mediator.Send(new RemoveFromWishlistCommand(listingId));
        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<List<ListingDto>>> GetMyWishlist()
    {
        var result = await _mediator.Send(new GetMyWishlistQuery());
        return Ok(result);
    }

    [HttpGet("check/{listingId}")]
    public async Task<ActionResult<bool>> IsListingWishlisted(Guid listingId)
    {
        var result = await _mediator.Send(new IsListingWishlistedQuery(listingId));
        return Ok(result);
    }
}
