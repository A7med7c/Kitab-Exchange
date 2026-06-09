using Kitab.Application.Health.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IMediator _mediator;

    public HealthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(HealthDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<HealthDto>> Get(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetHealthQuery(), cancellationToken);
        return Ok(result);
    }
}
