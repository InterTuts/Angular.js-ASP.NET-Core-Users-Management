// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Models.Dtos;
using api.Services.Interfaces;
using api.Utilities.Attributes;

// Namespace for Account Controllers
namespace api.Controllers.Account;

/// <summary>
/// Initializes a new instance of the <see cref="UsersController"/> class.
/// </summary>
/// <param name="optionsRepository">An instance to the users options repository</param>
[ApiController]
[Authorize]
[UserAccess]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/account")]
public class UserOptionsController(IUsersOptionsRepository optionsRepository) : ControllerBase {

    /// <summary>
    /// Update user's information
    /// </summary>
    /// <param name="userOptionsDto">User's Options</param>
    /// <returns>Return succes or error message</returns>
    [HttpPut("update")]
    public async Task<IActionResult> UpdateAccountOptions([FromBody] UserOptionsDto userOptionsDto) {

        

        // Retrieve the data from the attribute
        var userInfo = HttpContext.Items["user"] as dynamic;

        // Delete a user
        ResponseDto<bool> deleteUser = await optionsRepository.UpdateAsync(userInfo!.UserId, userOptionsDto);

        // Check if the user was deleted
        if ( deleteUser.Result ) {

            // Return success message
            return new JsonResult(new {
                success = true,
                message = deleteUser.Message
            });                

        } else {

            // Return error response
            return new JsonResult(new {
                success = false,
                message = deleteUser.Message
            });

        }

    }

}