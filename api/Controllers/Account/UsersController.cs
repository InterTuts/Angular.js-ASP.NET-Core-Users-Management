// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Account;
using api.Services.Interfaces;
using api.Utilities.Attributes;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="UsersController"/> class.
/// </summary>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[Authorize]
[UserAccess]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/account/[controller]")]
public class UsersController(IUsersRepository usersRepository) : ControllerBase {

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

}