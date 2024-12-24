// System Utils
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Options;
using api.Services.Interfaces;
using api.Utilities;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="SignInController"/> class.
/// </summary>
/// <param name="options">All App Options.</param>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth/[controller]")]
public class SignInController(IOptions<AppSettings> options, IUsersRepository usersRepository) : ControllerBase {

    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="signInDto">Data transfer object with user information</param>
    /// <returns>Success message and user's data or error message</returns>
    [HttpPost]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> SignIn([FromBody] SignInDto signInDto) {

        try {

            // Checks if the user data is correct
            ResponseDto<UserDto> user = await usersRepository.SignInAsync(signInDto);

            // Verify if the login is not successfully
            if (user.Result == null) {
                // Return a json
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("IncorrectEmailPassword")
                });
            }

            // Create user's data
            UserDto userDto = new() {
                UserId = user.Result.UserId,
                Email = user.Result.Email
            };

            // Generate token
            string token = Tokens.GenerateToken(options, userDto);

            // Return a json with response
            return new JsonResult(new {
                success = true,
                message = user.Message,
                content = new {
                    userId = user.Result.UserId.ToString(),
                    email = user.Result.Email,
                    token
                }
            });

        } catch (InvalidOperationException e) {
            Console.WriteLine(e.Message);

            // Create a error response
            var response = new {
                success = false,
                message = Words.Get("ErrorOccurred")
            };

            // Return a json
            return new JsonResult(response);                 

        }

    }
}