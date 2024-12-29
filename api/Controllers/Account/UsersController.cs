// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Account;
using api.Services.Interfaces;
using api.Utilities.Attributes;
using api.Utilities;

// Namespace for Account Controllers
namespace api.Controllers.Account;

/// <summary>
/// Initializes a new instance of the <see cref="UsersController"/> class.
/// </summary>
/// <param name="logger">Logger instance</param>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[Authorize]
[UserAccess]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/account/[controller]")]
public class UsersController(IUsersRepository usersRepository, ILogger<UsersController> logger) : ControllerBase {

    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="createUserDto">Data transfer object with user information</param>
    /// <returns>Success or fail message for user creation</returns>
    [HttpPost("create")]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto) {
        
        // Create user
        ResponseDto<UserDto> createUser = await usersRepository.CreateUserAsync(createUserDto);

        // Verify if the account was created
        if (createUser.Result != null) {

            // Create a success response
            var response = new
            {
                success = true,
                message = createUser.Message
            };

            // Return a json
            return new JsonResult(response);
        } else {

            // Create a error response
            var response = new
            {
                success = false,
                message = createUser.Message
            };

            // Return a json
            return new JsonResult(response);

        }

    }

    /// <summary>
    /// Gets the users list
    /// </summary>
    /// <param name="searchDto">Search parameters</param>
    /// <returns>Users list or error message</returns>
    [HttpGet("list")]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> UserList([FromQuery] SearchDto searchDto) {

        try {

            // Get all users
            ResponseDto<ItemsDto<UserDto>> usersList = await usersRepository.GetUsersAsync(searchDto);

            // Verify if users exists
            if ( usersList.Result != null ) {

                // Return users response
                return new JsonResult(new {
                    success = true,
                    content = new {
                        items = usersList.Result.Items,
                        page = usersList.Result.Page,
                        total = usersList.Result.Total
                    }
                });

            } else {

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = usersList.Message
                });

            }

        } catch (Exception e) {
            // Logging the exception
            logger.LogError(e, "An error occurred while user updating options.");  

            // Return error response
            return new JsonResult(new {
                success = false,
                message = Words.Get("UserOptionsNotSaved")
            });            

        }

    }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>Users list or error message</returns>
    [HttpDelete("{id}/delete")]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> DeleteUser(int id) {

        // Delete a user
        ResponseDto<bool> deleteUser = await usersRepository.DeleteUserAsync(id);

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