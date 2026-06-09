using Kitab.Application.ContactRequests.Commands.AcceptContactRequest;
using Kitab.Application.ContactRequests.Commands.RejectContactRequest;
using Kitab.Application.ContactRequests.Commands.SendContactRequest;
using Kitab.Application.ContactRequests.Queries.GetIncomingContactRequests;
using Kitab.Application.ContactRequests.Queries.GetOutgoingContactRequests;
using Kitab.Application.ContactRequests.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ContactRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContactRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("incoming")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ContactRequestDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyCollection<ContactRequestDto>>> GetIncoming(
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetIncomingContactRequestsQuery(), cancellationToken));
    }

    [HttpGet("outgoing")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ContactRequestDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyCollection<ContactRequestDto>>> GetOutgoing(
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetOutgoingContactRequestsQuery(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ContactRequestDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ContactRequestDto>> Send(
        SendContactRequestCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Contact request creation failed."));
        }

        return Created($"api/contactrequests/{result.Data.Id}", result.Data);
    }

    [HttpPost("{id:guid}/accept")]
    [ProducesResponseType(typeof(ContactRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ContactRequestDto>> Accept(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new AcceptContactRequestCommand(id), cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Contact request acceptance failed."));
        }

        return Ok(result.Data);
    }

    [HttpPost("{id:guid}/reject")]
    [ProducesResponseType(typeof(ContactRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ContactRequestDto>> Reject(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RejectContactRequestCommand(id), cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Contact request rejection failed."));
        }

        return Ok(result.Data);
    }

    private ProblemDetails ToProblemDetails(string detail)
    {
        return new ProblemDetails
        {
            Title = "Contact request failed",
            Detail = detail,
            Instance = HttpContext.Request.Path
        };
    }
}
