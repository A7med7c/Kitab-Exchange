using System.Net;
using System.Net.Http.Json;
using Kitab.Application.Health.Queries;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Kitab.API.Tests;

public class HealthEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public HealthEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetHealth_ReturnsOkWithHealthyStatus()
    {
        var response = await _client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<HealthDto>();
        Assert.NotNull(body);
        Assert.Equal("Healthy", body.Status);
        Assert.Equal("Kitab.API", body.Service);
    }

    [Fact]
    public async Task DiagnosticsThrow_ReturnsProblemDetails()
    {
        var response = await _client.GetAsync("/api/diagnostics/throw");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var json = await response.Content.ReadAsStringAsync();
        Assert.Contains("An unexpected error occurred", json);
    }
}
