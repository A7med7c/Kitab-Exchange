using Kitab.Application.Categories.Commands.CreateCategory;
using Kitab.Application.Categories.Commands.DeleteCategory;
using Kitab.Application.Categories.Commands.UpdateCategory;
using Xunit;

namespace Kitab.API.Tests;

public class CategoryValidatorTests
{
    [Fact]
    public void CreateCategoryCommandValidator_AcceptsValidCategory()
    {
        var validator = new CreateCategoryCommandValidator();

        var result = validator.Validate(new CreateCategoryCommand(
            "Science Fiction",
            "Speculative novels and short stories."));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void CreateCategoryCommandValidator_RejectsMissingName()
    {
        var validator = new CreateCategoryCommandValidator();

        var result = validator.Validate(new CreateCategoryCommand(string.Empty, null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Name");
    }

    [Fact]
    public void UpdateCategoryCommandValidator_RequiresIdAndName()
    {
        var validator = new UpdateCategoryCommandValidator();

        var result = validator.Validate(new UpdateCategoryCommand(Guid.Empty, string.Empty, null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Id");
        Assert.Contains(result.Errors, error => error.PropertyName == "Name");
    }

    [Fact]
    public void DeleteCategoryCommandValidator_RequiresId()
    {
        var validator = new DeleteCategoryCommandValidator();

        var result = validator.Validate(new DeleteCategoryCommand(Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Id");
    }
}
