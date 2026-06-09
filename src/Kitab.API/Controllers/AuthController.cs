using Kitab.Application.Auth.Commands.AssignRole;
using Kitab.Application.Auth.Commands.Login;
using Kitab.Application.Auth.Commands.RefreshToken;
using Kitab.Application.Auth.Commands.Register;
using Kitab.Application.Auth.DTOs;
using Kitab.Application.Auth.Queries.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> Register(
        RegisterCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Registration failed."));
        }

        return CreatedAtAction(nameof(Me), new { id = result.Data.UserId }, result.Data);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return Unauthorized(ToProblemDetails(result.Error ?? "Login failed."));
        }

        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(
        RefreshTokenCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return Unauthorized(ToProblemDetails(result.Error ?? "Refresh token failed."));
        }

        return Ok(result.Data);
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(CurrentUserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CurrentUserDto>> Me(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCurrentUserQuery(), cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return Unauthorized(ToProblemDetails(result.Error ?? "User context was not found."));
        }

        return Ok(result.Data);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("roles")]
    [ProducesResponseType(typeof(AssignRoleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AssignRoleResponseDto>> AssignRole(
        AssignRoleCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (!result.Succeeded || result.Data is null)
        {
            return BadRequest(ToProblemDetails(result.Error ?? "Role assignment failed."));
        }

        return Ok(result.Data);
    }

    private ProblemDetails ToProblemDetails(string detail)
    {
        return new ProblemDetails
        {
            Title = "Authentication request failed",
            Detail = detail,
            Instance = HttpContext.Request.Path
        };
    }
}
