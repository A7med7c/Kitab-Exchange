using FluentValidation;
using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Auth.Commands.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string DisplayName,
    string? PhoneNumber) : IRequest<Result<AuthResponseDto>>;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(command => command.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128);

        RuleFor(command => command.DisplayName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(command => command.PhoneNumber)
            .MaximumLength(32)
            .When(command => !string.IsNullOrWhiteSpace(command.PhoneNumber));
    }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponseDto>>
{
    private readonly IAuthenticationService _authenticationService;

    public RegisterCommandHandler(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    public Task<Result<AuthResponseDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return _authenticationService.RegisterAsync(
            request.Email,
            request.Password,
            request.DisplayName,
            request.PhoneNumber,
            cancellationToken);
    }
}
