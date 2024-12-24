// App Namespaces
using api.Utilities.Validations;

// Namespace for Auth Dto
namespace api.Models.Dtos.Auth;

/// <summary>
/// Social Dto Class
/// </summary>
public class SocialDto {
    /// <summary>
    /// User Social ID Field
    /// </summary>
    [ValidCode]
    public string? SocialId { get; set; }
    /// <summary>
    /// User Email Field
    /// </summary>
    [ValidEmail]
    public string? Email { get; set; }
    /// <summary>
    /// User Password Field
    /// </summary>
    [ValidPassword]
    public string? Password { get; set; }
}