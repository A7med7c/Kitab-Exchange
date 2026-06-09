using Kitab.Application.Listings.Commands.CreateListing;
using Kitab.Application.Listings.Commands.DeleteListing;
using Kitab.Application.Listings.Commands.UpdateListing;
using Kitab.Application.Listings.DTOs;
using Kitab.Application.Listings.Queries.GetAllListings;
using Kitab.Application.Listings.Queries.GetListing;
using Kitab.Application.Listings.Queries.GetMyListings;
using Kitab.Application.Listings.Queries.SearchListings;
using Kitab.Application.Common.Interfaces;
using Kitab.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IListingImageService _listingImageService;

    public ListingsController(IMediator mediator, IListingImageService listingImageService)
    {
        _mediator = mediator;
        _listingImageService = listingImageService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ListingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ListingDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAllListingsQuery(), cancellationToken));
    }

    [Authorize]
    [HttpGet("mine")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ListingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyCollection<ListingDto>>> GetMine(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetMyListingsQuery(), cancellationToken));
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ListingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyCollection<ListingDto>>> Search(
        [FromQuery] string? term,
        [FromQuery] ListingCondition? condition,
        [FromQuery] ListingType? listingType,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        CancellationToken cancellationToken)
    {
        var query = new SearchListingsQuery(term, condition, listingType, minPrice, maxPrice);
        return Ok(await _mediator.Send(query, cancellationToken));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ListingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ListingDto>> Get(Guid id, CancellationToken cancellationToken)
    {
        var listing = await _mediator.Send(new GetListingQuery(id), cancellationToken);
        return listing is null ? NotFound(ToProblemDetails("Listing was not found.")) : Ok(listing);
    }

    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ListingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ListingDto>> Create(
        CreateListingCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Listing creation failed."));
        }

        return CreatedAtAction(nameof(Get), new { id = result.Data.Id }, result.Data);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ListingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ListingDto>> Update(
        Guid id,
        UpdateListingCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command with { Id = id }, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Listing update failed."));
        }

        return Ok(result.Data);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteListingCommand(id), cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Listing deletion failed."));
        }

        return NoContent();
    }

    [Authorize]
    [HttpPost("upload-image")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    [ProducesResponseType(typeof(UploadImageResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UploadImageResponseDto>> UploadImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(ToProblemDetails("Image file is required."));
        }

        await using var stream = file.OpenReadStream();
        var result = await _listingImageService.SaveImageAsync(
            stream,
            file.FileName,
            file.ContentType,
            file.Length,
            cancellationToken);

        if (!result.Succeeded || result.Url is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Image upload failed."));
        }

        return Ok(new UploadImageResponseDto(result.Url));
    }

    private ProblemDetails ToProblemDetails(string detail)
    {
        return new ProblemDetails
        {
            Title = "Listing request failed",
            Detail = detail,
            Instance = HttpContext.Request.Path
        };
    }
}
