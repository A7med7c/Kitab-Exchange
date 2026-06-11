using System.Net.Security;
using Kitab.Application.Admin.DTOs;
using Kitab.Application.Admin.Queries.GetAdminDashboard;
using Kitab.Application.Listings.Commands.AdminDeleteListing;
using Kitab.Application.Listings.DTOs;
using Kitab.Application.Listings.Queries.GetAllListings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(AdminDashboardDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAdminDashboardQuery(), cancellationToken));
    }

    [HttpGet("listings")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ListingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ListingDto>>> GetListings(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAllListingsQuery(), cancellationToken));
    }

    [HttpDelete("listings/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteListing(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new AdminDeleteListingCommand(id), cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Listing deletion failed."));
        }

        return NoContent();
    }

    private ProblemDetails ToProblemDetails(string detail)
    {
        return new ProblemDetails
        {
            Title = "Admin request failed",
            Detail = detail,
            Instance = HttpContext.Request.Path
        };
    }
}
