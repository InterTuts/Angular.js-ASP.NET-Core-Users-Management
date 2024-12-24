// System Utils
using System.Web;
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
/// Initializes a new instance of the <see cref="SocialController"/> class.
/// </summary>
/// <param name="options">All App Options.</param>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class SocialController(IOptions<AppSettings> options, IUsersRepository usersRepository) : ControllerBase
{

    /// <summary>
    /// Generates the redirect page to google
    /// </summary>
    /// <returns>Success with redirect url/returns>
    [HttpGet("google-connect")]
    [EnableCors("MainPolicy")]
    public IActionResult GoogleConnect()
    {

        // Get environment variables
        string clientId = options.Value.Google.ClientId;
        string websiteUrl = options.Value.SiteUrl;

        // Redirect parameters
        var queryParams = HttpUtility.ParseQueryString(string.Empty);
        queryParams["client_id"] = clientId;
        queryParams["scope"] = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
        queryParams["redirect_uri"] = $"{websiteUrl}api/auth/social-register";
        queryParams["response_type"] = "code";
        queryParams["access_type"] = "offline";
        queryParams["prompt"] = "consent";

        // Build the redirect URL
        string redirectUrl = $"https://accounts.google.com/o/oauth2/v2/auth?{queryParams}";

        // Return a json with redirect url
        return new JsonResult(new
        {
            success = false,
            redirectUrl
        });

    }

    /// <summary>
    /// Exchange authorization code for a token
    /// </summary>
    /// <param name="codeDto">Data transfer object with authorization code</param>
    /// <returns>Success or false message/returns>
    [HttpPost("google-token")]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> GoogleToken([FromBody] CodeDto codeDto) {

        try {

            // Verify if authorization code exists
            if (codeDto.Code == null) {

                // Return a json
                return new JsonResult(new
                {
                    success = false,
                    message = Words.Get("AuthorizationCodeNotValid")
                });

            }

            // Get environment variables
            string clientId = options.Value.Google.ClientId;
            string clientSecret = options.Value.Google.ClientSecret;
            string websiteUrl = options.Value.SiteUrl;

            // Init the http client
            using HttpClient httpClient = new();

            // Create the content
            Dictionary<string, string> content = new()
            {
                { "client_id", clientId },
                { "client_secret", clientSecret },
                { "code", Uri.UnescapeDataString(codeDto.Code) },
                { "redirect_uri", $"{websiteUrl}api/auth/social-register" },
                { "grant_type", "authorization_code" },
                { "access_type", "offline" },
                { "prompt", "consent" }
            };

            // Encode the content
            FormUrlEncodedContent requestContent = new(content);

            // Set request
            HttpResponseMessage responseToken = await httpClient.PostAsync("https://www.googleapis.com/oauth2/v4/token", requestContent);

            // Verify if has been occurred an error
            if ( !responseToken.IsSuccessStatusCode ) {

                // Request failed
                string errorMessage = await responseToken.Content.ReadAsStringAsync();

                // Decode the error message
                dynamic errorMessageDecode = Newtonsoft.Json.JsonConvert.DeserializeObject(errorMessage)!;  

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = HttpUtility.HtmlDecode(errorMessageDecode["error_description"].ToString())
                });

            }

            // Read the response
            string responseTokenJson = await responseToken.Content.ReadAsStringAsync();

            // Decode the Response
            dynamic responseTokenDecode = Newtonsoft.Json.JsonConvert.DeserializeObject(responseTokenJson)!;

            // Verify if access token exists
            if ( (responseTokenDecode == null) || !responseTokenDecode!.ContainsKey("access_token") ) {

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("AccessCodeNotGenerated")
                });
                
            }

            // Initialize a new Http Client session
            using HttpClient accountDataRequest = new();

            // Request the account data using the token
            HttpResponseMessage accountDataMessage = await accountDataRequest.GetAsync("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + responseTokenDecode!["access_token"]);

            // Verify if has been occurred an error
            if ( !accountDataMessage.IsSuccessStatusCode ) {

                // Request failed
                string errorMessage = await accountDataMessage.Content.ReadAsStringAsync();

                // Decode the error message
                dynamic errorMessageDecode = Newtonsoft.Json.JsonConvert.DeserializeObject(errorMessage)!;  

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = HttpUtility.HtmlDecode(errorMessageDecode["error_description"].ToString())
                });

            }

            // Get request
            string accountJson = await accountDataMessage.Content.ReadAsStringAsync(); 

            // Decode the Response
            dynamic responseAccountDecode = Newtonsoft.Json.JsonConvert.DeserializeObject(accountJson)!;
            
            // User data
            UserDto userDto = new () {
                SocialId = responseAccountDecode["id"]
            };

            // Get user
            ResponseDto<UserDto> getUser = await usersRepository.UserBySocialIdAsync(userDto);

            // Check if user exists
            if ( getUser.Result != null ) {

                // Set user's ID
                userDto.UserId = getUser.Result.UserId;

                // Set user's email
                userDto.Email = getUser.Result.Email;

                // Generate token
                string token = Tokens.GenerateToken(options, userDto);

                // Return a json with response
                return new JsonResult(new {
                    success = true,
                    message = Words.Get("SuccessSignIn"),
                    content = new {
                        userId = getUser.Result.UserId.ToString(),
                        email = getUser.Result.Email,
                        token
                    }
                });

            }

            // Return a json with response
            return new JsonResult(new {
                success = true,
                message = Words.Get("RegistrationRequired"),
                content = new {
                    socialId = responseAccountDecode["id"].ToString(),
                    email = responseAccountDecode["email"].ToString()
                }
            });            

        } catch (InvalidOperationException e) {

            Console.WriteLine(e.Message);

            // Create a error response
            var response = new
            {
                success = false,
                message = Words.Get("ErrorOccurred")
            };

            // Return a json
            return new JsonResult(response);

        }

    }

    /// <summary>
    /// Creates a new user account using Google
    /// </summary>
    /// <param name="socialDto">Data transfer object with social id and password</param>
    /// <returns>Success or false message/returns>
    [HttpPost("google-register")]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> GoogleRegister([FromBody] SocialDto socialDto) {

        try {

            // Verify if password exists
            if ( socialDto.Password == null ) {

                // Return a json
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("PleaseEnterPassword")
                });

            }

            // Verify if social id exists
            if (socialDto.SocialId == null) {

                // Return a json
                return new JsonResult(new
                {
                    success = false,
                    message = Words.Get("SocialIdNotValid")
                });

            }  

            // Verify if email exists
            if (socialDto.Email == null) {

                // Return a json
                return new JsonResult(new
                {
                    success = false,
                    message = Words.Get("EmailRequired")
                });

            }          

            // Create the member
            RegistrationDto registrationDto = new() {
                Email = socialDto.Email,
                Password = socialDto.Password,
                SocialId = socialDto.SocialId
            };

            // Create user
            ResponseDto<UserDto> createUser = await usersRepository.RegisterUserAsync(registrationDto);

            // Verify if the account was created
            if (createUser.Result == null) {

                // Create a error response
                var response = new
                {
                    success = false,
                    message = createUser.Message
                };

                // Return a json
                return new JsonResult(response);

            }

            // User data
            UserDto userDto = new () {
                SocialId = socialDto.SocialId
            };

            // Get user
            ResponseDto<UserDto> getUser = await usersRepository.UserBySocialIdAsync(userDto);

            // Verify if user exists
            if ( getUser.Result == null ) {

                // Return a json
                return new JsonResult(new
                {
                    success = false,
                    message = Words.Get("AccountNotFound")
                });
                
            }

            // Sign In Container
            SignInDto signInDto = new () {
                Email = socialDto.Email,
                Password = socialDto.Password
            };

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

            // Generate token
            string token = Tokens.GenerateToken(options, user.Result);

            // Return a json with response
            return new JsonResult(new {
                success = true,
                message = Words.Get("AccountCreated"),
                content = new {
                    userId = user.Result.UserId.ToString(),
                    user.Result.Email,
                    token = token
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