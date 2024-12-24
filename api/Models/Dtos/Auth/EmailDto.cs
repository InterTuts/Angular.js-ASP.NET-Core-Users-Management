// App Namespaces
using api.Utilities.Validations;

// Namespace for Auth Dto
namespace api.Models.Dtos.Auth;

/// <summary>
/// Email Dto Class
/// </summary>
public class EmailDto {
    /// <summary>
    /// User Email Field
    /// </summary>
    [ValidEmail]
    public string? Email { get; set; }
}