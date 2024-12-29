// App Namespaces
using api.Utilities.Sanitization;
using api.Utilities.Validations;

// Namespace for Account Dto
namespace api.Models.Dtos.Account;

/// <summary>
/// Create New User Dto Class
/// </summary>
public class CreateUserDto {

    // First Name Holder
    private string? _firstName;

    // Last Name Holder
    private string? _lastName;

    // Email Holder
    private string? _email;    

    // Password Holder
    private string? _password;

    /// <summary>
    /// First Name Field
    /// </summary>
    [ValidName]
    public string? FirstName {
        get => _firstName;
        set => _firstName = value == null ? null : NameSanitization.SafeName(value);
    }

    /// <summary>
    /// Last Name Field
    /// </summary>
    [ValidName]
    public string? LastName {
        get => _lastName;
        set => _lastName = value == null ? null : NameSanitization.SafeName(value);
    }
    
    /// <summary>
    /// User Email Field
    /// </summary>
    [ValidEmail]
    public string? Email {
        get => _email;
        set => _email = value == null ? null : EmailSanitization.SafeEmail(value);        
    }

    /// <summary>
    /// User Password Field
    /// </summary>
    [ValidPassword]
    public string? Password {
        get => _password;
        set => _password = value == null ? null : PasswordSanitization.SafePassword(value);
    }
}