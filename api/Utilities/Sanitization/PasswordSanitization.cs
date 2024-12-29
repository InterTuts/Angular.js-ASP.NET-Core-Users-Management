// System Utils
using System.Text.RegularExpressions;

// Namespace for Account Controllers
namespace api.Utilities.Sanitization;

/// <summary>
/// Sanitize Passwords
/// </summary>
public static class PasswordSanitization {

    /// <summary>
    /// Sanitizes the Passwords
    /// </summary>
    /// <param name="input">Password input to sanitize</param>
    /// <returns>Sanitized name</returns>
    public static string SafePassword(string? input) {

        // Check if input's value exists
        if ( input == null ) {
            return "";
        }

        // Trim leading and trailing spaces
        string sanitized = input.Trim();

        // Allow letters, numbers, spaces, and specific special characters: . " ' ! @ / \ 
        sanitized = Regex.Replace(sanitized, @"[^a-zA-Z0-9\s.\""!@/\\']", ""); 

        return sanitized;

    }

}