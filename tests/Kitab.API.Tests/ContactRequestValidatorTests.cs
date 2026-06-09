using Kitab.Application.ContactRequests.Commands.AcceptContactRequest;
using Kitab.Application.ContactRequests.Commands.RejectContactRequest;
using Kitab.Application.ContactRequests.Commands.SendContactRequest;
using Xunit;

namespace Kitab.API.Tests;

public class ContactRequestValidatorTests
{
    [Fact]
    public void SendContactRequestCommandValidator_AcceptsValidRequest()
    {
        var validator = new SendContactRequestCommandValidator();
        var result = validator.Validate(new SendContactRequestCommand(
            Guid.NewGuid(),
            Kitab.Domain.Entities.RequestType.Contact,
            null,
            "I am interested in this book."));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void SendContactRequestCommandValidator_RejectsMissingListingId()
    {
        var validator = new SendContactRequestCommandValidator();
        var result = validator.Validate(new SendContactRequestCommand(
            Guid.Empty,
            Kitab.Domain.Entities.RequestType.Contact,
            null,
            null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "ListingId");
    }

    [Fact]
    public void AcceptContactRequestCommandValidator_RejectsMissingId()
    {
        var validator = new AcceptContactRequestCommandValidator();
        var result = validator.Validate(new AcceptContactRequestCommand(Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Id");
    }

    [Fact]
    public void RejectContactRequestCommandValidator_RejectsMissingId()
    {
        var validator = new RejectContactRequestCommandValidator();
        var result = validator.Validate(new RejectContactRequestCommand(Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Id");
    }
}
