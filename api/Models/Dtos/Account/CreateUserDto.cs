// App Namespaces
using api.Utilities.Validations;

// Namespace for Account Dto
namespace api.Models.Dtos.Account;

/// <summary>
/// Create New User Dto Class
/// </summary>
public class CreateUserDto {

    /// <summary>
    /// First Name Field
    /// </summary>
    [ValidName]
    public string? First_name { get; set; }

    /// <summary>
    /// Last Name Field
    /// </summary>
    [ValidName]
    public string? Last_name { get; set; }
    
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