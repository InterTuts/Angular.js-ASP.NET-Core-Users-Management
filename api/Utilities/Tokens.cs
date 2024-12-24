// System Utils
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

// App Utils
using api.Options;
using api.Models.Dtos;


namespace api.Utilities;

/// <summary>
/// This class provides some methods to works with the Jwt tokens
/// </summary>
public static class Tokens {

    /// <summary>
    /// Generate new JWT token
    /// </summary>
    /// <param name="options">The application settings containing JWT configuration.</param>
    /// <param name="user">The user's data.</param>
    /// <returns>The generated access token as a string.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the JWT key is missing in the application settings.</exception>
    public static string GenerateToken(IOptions<AppSettings> options, UserDto user) {

        // Prepare and define the secret key
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.JwtSettings.Key ?? throw new InvalidOperationException("JWT key is missing")));

        // Create a signature with the key
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Create a new list with token data as claims
        var claims = new List<Claim> {
            new("UserId", user.UserId.ToString(), ClaimValueTypes.String),
            new(JwtRegisteredClaimNames.Sub, user.Email?.ToString() ?? user.UserId.ToString(), ClaimValueTypes.String),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString(), ClaimValueTypes.String)
        };

        // Create the token
        var token = new JwtSecurityToken(
            issuer: options.Value.JwtSettings.Issuer,
            audience: options.Value.JwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        // Return the serialized token
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Get token data by claim field
    /// </summary>
    /// <param name="accessToken">Access token</param>
    /// <param name="field">Token field</param>
    /// <returns>string with field's data</returns>
    public static string GetTokenData(string accessToken, string field) {
        // Default response
        var response = string.Empty;

        // Get the token handler
        var handler = new JwtSecurityTokenHandler();

        // Verify if the token is readable
        if (handler.CanReadToken(accessToken)) {
            var jsonToken = handler.ReadJwtToken(accessToken);
            return jsonToken.Claims.FirstOrDefault(c => c.Type == field)?.Value ?? string.Empty;
        }

        return string.Empty;
    }
}