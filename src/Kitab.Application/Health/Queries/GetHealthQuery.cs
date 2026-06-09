using MediatR;

namespace Kitab.Application.Health.Queries;

public record GetHealthQuery : IRequest<HealthDto>;

public record HealthDto(string Status, string Service, DateTimeOffset Timestamp);

public class GetHealthQueryHandler : IRequestHandler<GetHealthQuery, HealthDto>
{
    public Task<HealthDto> Handle(GetHealthQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(new HealthDto(
            "Healthy",
            "Kitab.API",
            DateTimeOffset.UtcNow));
    }
}
