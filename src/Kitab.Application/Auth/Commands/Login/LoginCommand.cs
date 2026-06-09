using FluentValidation;
using Kitab.Application.Auth.DTOs;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Auth.Commands.Login;

public record LoginCommand(
    string Email,
    string Password) : IRequest<Result<AuthResponseDto>>;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(command => command.Password)
            .NotEmpty()
            .MaximumLength(128);
    }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private readonly IAuthenticationService _authenticationService;

    public LoginCommandHandler(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    public Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return _authenticationService.LoginAsync(request.Email, request.Password, cancellationToken);
    }
}
