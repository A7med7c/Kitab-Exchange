using Microsoft.AspNetCore.Mvc;

namespace Kitab.API.Controllers;

/// <summary>
/// Development-only endpoints for verifying ProblemDetails middleware.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase
{
    [HttpGet("throw")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public IActionResult Throw()
    {
        throw new InvalidOperationException("Diagnostic error for ProblemDetails verification.");
    }
}
