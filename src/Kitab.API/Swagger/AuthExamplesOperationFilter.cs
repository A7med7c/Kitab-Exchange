using Kitab.Application.Auth.Commands.AssignRole;
using Kitab.Application.Auth.Commands.Login;
using Kitab.Application.Auth.Commands.RefreshToken;
using Kitab.Application.Auth.Commands.Register;
using Kitab.Application.Categories.Commands.CreateCategory;
using Kitab.Application.Categories.Commands.UpdateCategory;
using Kitab.Application.Listings.Commands.CreateListing;
using Kitab.Application.Listings.Commands.UpdateListing;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Kitab.API.Swagger;

public class AuthExamplesOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.RequestBody is null ||
            !operation.RequestBody.Content.TryGetValue("application/json", out var mediaType))
        {
            return;
        }

        var requestType = context.MethodInfo.GetParameters().FirstOrDefault()?.ParameterType;
        if (requestType is null)
        {
            return;
        }

        mediaType.Example = requestType switch
        {
            Type type when type == typeof(RegisterCommand) => new OpenApiObject
            {
                ["email"] = new OpenApiString("reader@example.com"),
                ["password"] = new OpenApiString("Passw0rd!"),
                ["displayName"] = new OpenApiString("Ahmed Reader"),
                ["phoneNumber"] = new OpenApiString("+201001112223")
            },
            Type type when type == typeof(LoginCommand) => new OpenApiObject
            {
                ["email"] = new OpenApiString("reader@example.com"),
                ["password"] = new OpenApiString("Passw0rd!")
            },
            Type type when type == typeof(RefreshTokenCommand) => new OpenApiObject
            {
                ["userId"] = new OpenApiString("11111111-1111-1111-1111-111111111111"),
                ["refreshToken"] = new OpenApiString("base64-refresh-token-from-login")
            },
            Type type when type == typeof(AssignRoleCommand) => new OpenApiObject
            {
                ["userId"] = new OpenApiString("11111111-1111-1111-1111-111111111111"),
                ["role"] = new OpenApiString("Admin")
            },
            Type type when type == typeof(CreateCategoryCommand) => CategoryExample(),
            Type type when type == typeof(UpdateCategoryCommand) => CategoryExample(),
            Type type when type == typeof(CreateListingCommand) => ListingExample(),
            Type type when type == typeof(UpdateListingCommand) => ListingExample(),
            _ => mediaType.Example
        };
    }

    private static OpenApiObject ListingExample()
    {
        return new OpenApiObject
        {
            ["title"] = new OpenApiString("Clean Code"),
            ["author"] = new OpenApiString("Robert C. Martin"),
            ["category"] = new OpenApiString("Programming"),
            ["condition"] = new OpenApiString("Good"),
            ["description"] = new OpenApiString("A used copy in good condition."),
            ["listingType"] = new OpenApiString("ForSale"),
            ["status"] = new OpenApiString("Available"),
            ["price"] = new OpenApiDouble(250)
        };
    }

    private static OpenApiObject CategoryExample()
    {
        return new OpenApiObject
        {
            ["name"] = new OpenApiString("Science Fiction"),
            ["description"] = new OpenApiString("Speculative novels and short stories.")
        };
    }
}
