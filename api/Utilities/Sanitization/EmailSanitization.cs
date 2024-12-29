// System Utils
using System.Text.RegularExpressions;

// Namespace for Account Controllers
namespace api.Utilities.Sanitization;

/// <summary>
/// Sanitize Emails
/// </summary>
public static class EmailSanitization {

    /// <summary>
    /// Sanitizes the Emails
    /// </summary>
    /// <param name="input">Email input to sanitize</param>
    /// <returns>Sanitized name</returns>
    public static string SafeEmail(string? input) {

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