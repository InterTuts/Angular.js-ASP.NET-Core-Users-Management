// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Services.Interfaces;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="RegistrationController"/> class.
/// </summary>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth/[controller]")]
public class RegistrationController(IUsersRepository usersRepository) : ControllerBase
{
    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="registrationDto">Data transfer object with user information</param>
    /// <returns>Success message and user's data or error message</returns>
    [HttpPost]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> Registration([FromBody] RegistrationDto registrationDto)
    {
       
        // Create user
        ResponseDto<UserDto> createUser = await usersRepository.RegisterUserAsync(registrationDto);

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