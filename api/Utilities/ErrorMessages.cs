// Namespace for General utilities
namespace api.Utilities;

/// <summary>
/// Errors Messages Manager
/// </summary>
public static class ErrorMessages
{
    /// <summary>
    /// Error message for missing email
    /// </summary>
    public static string EmailRequired => Words.Get("EmailRequired");

    /// <summary>
    /// Error message for too long email
    /// </summary>
    public static string EmailLong => Words.Get("EmailLong");

    /// <summary>
    /// Error message for missing password
    /// </summary>
    public static string PasswordRequired => Words.Get("PasswordRequired");

    /// <summary>
    /// Error message for too long password
    /// </summary>
    public static string PasswordLong => Words.Get("PasswordLong");

    /// <summary>
    /// Error message if first name has wrong length
    /// </summary>
    public static string FirstNameWrongLength => Words.Get("FirstNameWrongLength");

    /// <summary>
    /// Error message if last name has wrong length
    /// </summary>
    public static string LastNameWrongLength => Words.Get("LastNameWrongLength");

}