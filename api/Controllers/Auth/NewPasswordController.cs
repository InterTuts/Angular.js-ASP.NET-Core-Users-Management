// System Utils
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Services.Interfaces;
using api.Utilities;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="PasswordController"/> class.
/// </summary>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth/new-password")]
public class NewPasswordController(IUsersRepository usersRepository) : ControllerBase
{

    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="passwordDto">Data transfer object with user information</param>
    /// <returns>Success message and user's data or error message</returns>
    [HttpPost]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> ChangePassword([FromBody] PasswordDto passwordDto)
    {

        try {

            // Default response
            var userId = string.Empty;

            // Get the token handler
            var handler = new JwtSecurityTokenHandler();

            // Verify if the token is readable
            if (handler.ReadToken(passwordDto.Code) is JwtSecurityToken jsonToken) {

                // Get the expiration claim
                var expirationClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "exp");

                if (expirationClaim != null) {

                    // Convert the expiration time from Unix timestamp to DateTime
                    var exp = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expirationClaim.Value)).UtcDateTime;

                    // Check if the token is expired
                    if (DateTime.UtcNow > exp) {
                                
                        // Return error response
                        return new JsonResult(new {
                            success = false,
                            message = Words.Get("ResetCodeExpired")
                        });

                    }

                }

                // Get data by field
                var fieldData = jsonToken.Claims.FirstOrDefault(c => c.Type == "UserId");

                // Verify if data exists
                if ( fieldData != null ) {

                    // Replace the default response
                    userId = fieldData.Value;

                }

            }

            // Verify if userId is not null
            if ( userId == null ) {

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("ResetCodeExpired")
                });

            }

            // Verify if password exists
            if ( passwordDto.Password == null ) {

                // Return a json
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("PleaseEnterPassword")
                });

            }

            // Create the user data
            UserDto userData = new() {
                UserId = int.Parse(userId),
                Password = passwordDto.Password.Trim()
            };

            // User the user's data
            ResponseDto<bool> UpdateUser = await usersRepository.UpdatePasswordAsync(userData);

            // Verify if user exists
            if ( UpdateUser.Result ) {

                // Return a json
                return new JsonResult(new {
                    success = true,
                    message = Words.Get("PasswordWasChanged")
                });

            } else {

                // Return a json
                return new JsonResult(new {
                    success = false,
                    message = UpdateUser.Message ?? Words.Get("PasswordWasNotChanged")
                });

            }

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