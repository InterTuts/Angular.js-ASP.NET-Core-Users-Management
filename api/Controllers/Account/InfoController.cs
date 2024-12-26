// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Utilities.Attributes;

// Namespace for Account Controllers
namespace api.Controllers.Account;

/// <summary>
/// Initializes a new instance of the <see cref="InfoController"/> class.
/// </summary>
[ApiController]
[Authorize]
[UserAccess]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/account/[controller]")]
public class InfoController() : ControllerBase {

    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <returns>Success message and user's data or error message</returns>
    [HttpGet]
    [EnableCors("MainPolicy")]
    public IActionResult Info() {

        // Retrieve the data from the attribute
        var userInfo = HttpContext.Items["user"] as dynamic;

        // Return a json with response
        return new JsonResult(new {
            success = true,
            content = userInfo
        });
    }
}