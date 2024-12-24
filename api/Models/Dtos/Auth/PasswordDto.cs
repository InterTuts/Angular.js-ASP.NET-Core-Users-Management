// App Namespaces
using api.Utilities.Validations;

// Namespace for Auth Dto
namespace api.Models.Dtos.Auth;

/// <summary>
/// Password Dto Class
/// </summary>
public class PasswordDto
{
    /// <summary>
    /// User Code Field
    /// </summary>
    [ValidCode]
    public string? Code { get; set; }
    /// <summary>
    /// User Password Field
    /// </summary>
    [ValidPassword]
    public string? Password { get; set; }
}