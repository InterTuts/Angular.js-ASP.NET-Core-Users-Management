// System Namespaces
using Microsoft.AspNetCore.Mvc;    
using Microsoft.AspNetCore.Mvc.Filters;

// Namespace for Extensions
namespace api.Utilities.Extensions;

/// <summary>
/// Json Exception Filter
/// </summary>
public class JsonExceptionFilter : IExceptionFilter
{

    /// <summary>
    /// Turn exception message in json
    /// </summary>
    /// <param name="context"></param>
    public void OnException(ExceptionContext context)
    {

        // Re-create the error response
        var errorResponse = new
        {
            success = false,
            message = context.Exception.Message
        };

        // Set the status code to 200 Bad Request
        context.HttpContext.Response.StatusCode = 200;

        // Serialize the error response to JSON
        JsonResult jsonResult = new(errorResponse);

        // Replace the original response with the JSON error response
        context.Result = jsonResult;
        context.ExceptionHandled = true;

    }
    
}