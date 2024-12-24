// System Utils
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail; 
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Options;
using api.Services.Interfaces;
using api.Utilities;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="ResetController"/> class.
/// </summary>
/// <param name="options">All App Options.</param>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth/[controller]")]
public class ResetController(IOptions<AppSettings> options, IUsersRepository usersRepository) : ControllerBase
{
    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="resetDto">Data transfer object with user information</param>
    /// <returns>Success message and user's data or error message</returns>
    [HttpPost]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> Reset([FromBody] EmailDto resetDto) {

        try {

            // Get the email
            ResponseDto<UserDto> userEmail = await usersRepository.GetUserEmailAsync(resetDto);
            
            // Verify if a user was found
            if ( userEmail.Result == null ) {

                // Return error response
                return new JsonResult(new {
                    success = false,
                    message = Words.Get("EmailNotFound")
                });

            }
            
            // Prepare and define the secret key
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.JwtSettings.Key ?? string.Empty));

            // Create aa signature with the key
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create a new list with token data as claims
            var claims = new List<Claim>() {
                new("UserId", userEmail.Result.UserId.ToString() ?? string.Empty, ClaimValueTypes.String),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString(), ClaimValueTypes.String)
            };

            // Create the token
            var token = new JwtSecurityToken(
                issuer: options.Value.JwtSettings.Issuer,
                audience: options.Value.JwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: credentials
            );

            // Initialize the JwtSecurityTokenHandler class which validates, handles and creates access tokens
            var tokenHandler = new JwtSecurityTokenHandler();

            // Get Email Sender
            string emailSender = options.Value.Smtp.EmailFrom;

            // Get Smtp Host
            string smtpHost = options.Value.Smtp.SmtpHost;

            // Get Smtp Port
            string smtpPort = options.Value.Smtp.SmtpPort;  
            
            // Get Smtp Username
            string smtpUsername = options.Value.Smtp.SmtpUsername;
            
            // Get Smtp Password
            string smtpPassword = options.Value.Smtp.SmtpPassword;

            // Check if smtp is configured
            if ( (smtpHost != "") && (smtpPort != "") && (smtpUsername != "") && (smtpPassword != "") ) {

                // Initialize Simple Mail Transfer Protocol
                using SmtpClient client = new(smtpHost, int.Parse(smtpPort)) {

                    // Set credentials
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),

                    // Support for SSL and TSL
                    EnableSsl = true

                };

                // Create email body content
                string body = "<p>" + Words.Get("YourReceivingEmailPasswordReset") + "</p>"
                + "<p>" + Words.Get("CreateNewPassword") + "<a href=\"" + options.Value.SiteUrl + "/auth/new-password?code=" + tokenHandler.WriteToken(token) + "\" rel=\"noreferrer\" target=\"_blank\">" + options.Value.SiteUrl + "/auth/new-password?code=" + tokenHandler.WriteToken(token) + "</a></p>";

                // Create MailMessage object
                MailMessage message = new(emailSender, userEmail.Result.Email!, Words.Get("PasswordReset"), body) {

                    // Add support for html
                    IsBodyHtml = true

                };

                // Send mail
                await client.SendMailAsync(message);

            }                   

            // Create the json response
            var response = new {
                success = true,
                message = Words.Get("ResetLinkSent")
            };

            // Return a json with response
            return new JsonResult(response);

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