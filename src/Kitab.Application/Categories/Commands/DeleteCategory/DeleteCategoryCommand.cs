using FluentValidation;
using Kitab.Application.Common.Interfaces;
using Kitab.Application.Common.Models;
using MediatR;

namespace Kitab.Application.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest<Result>;

public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result>
{
    private readonly ICategoryRepository _categoryRepository;

    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public Task<Result> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        return _categoryRepository.DeleteAsync(request.Id, cancellationToken);
    }
}
