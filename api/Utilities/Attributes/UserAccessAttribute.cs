// System Utils
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

// App Utils
using api.Models.Dtos;
using api.Services.Interfaces;

// Namespace for attributes
namespace api.Utilities.Attributes;

/// <summary>
/// User Access to a controller
/// </summary>
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public class UserAccessAttribute : Attribute, IAsyncActionFilter {
    /// <summary>
    /// Filter the request
    /// </summary>
    /// <param name="context">Filters context</param>
    /// <param name="next">A delegate that asynchronously returns an ActionExecutedContext indicating the action or the next action filter has executed.</param>
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {
        
        // Verify if authorization exists
        if (context.HttpContext.Request.Headers.ContainsKey("Authorization"))
        {
            ResponseDto<UserDto>? user = null;

            // Verify if access token exists to get the user's data
            if (context.HttpContext.Request.Headers.TryGetValue("Authorization", out var authHeader)) {

                // Get the access token
                string? token = authHeader.FirstOrDefault()?.Split(" ").LastOrDefault();
 
                // Verify if access token exists
                if (token is not null)
                {
                    // Get the user's ID
                    string userId = Tokens.GetTokenData(token ?? string.Empty, "UserId");

                    // Verify if the user id exists
                    if (userId != "")
                    {
                        // Get the repository from the services.
                        var serviceProvider = context.HttpContext.RequestServices;
                        var usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();

                        // Retrieve the user's data
                        int parsedUserId = int.Parse(userId);
                        user = await usersRepository.GetUserAsync(parsedUserId);

                    }
                }
            }

            // Verify if user exists
            if (user?.Result != null)
            {
                // Save temporary user in http context item
                context.HttpContext.Items["user"] = user.Result;

                // Go next
                await next();
            }
            else
            {
                // Stop the access
                context.Result = new UnauthorizedResult();
            }
        }
        else
        {
            // Stop the access
            context.Result = new UnauthorizedResult();
        }

    }
}