using FluentValidation;
using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Auth.Commands.AssignRole;

public record AssignRoleCommand(
    Guid UserId,
    string Role) : IRequest<Result<AssignRoleResponseDto>>;

public class AssignRoleCommandValidator : AbstractValidator<AssignRoleCommand>
{
    private static readonly string[] AllowedRoles = ["User", "Admin"];

    public AssignRoleCommandValidator()
    {
        RuleFor(command => command.UserId)
            .NotEmpty();

        RuleFor(command => command.Role)
            .NotEmpty()
            .Must(role => AllowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Role must be either User or Admin.");
    }
}

public class AssignRoleCommandHandler : IRequestHandler<AssignRoleCommand, Result<AssignRoleResponseDto>>
{
    private readonly IAuthenticationService _authenticationService;

    public AssignRoleCommandHandler(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    public Task<Result<AssignRoleResponseDto>> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
    {
        return _authenticationService.AssignRoleAsync(request.UserId, request.Role, cancellationToken);
    }
}
