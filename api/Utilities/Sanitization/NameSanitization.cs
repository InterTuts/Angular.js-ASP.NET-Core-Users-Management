// System Utils
using System.Text.RegularExpressions;

// Namespace for Account Controllers
namespace api.Utilities.Sanitization;

/// <summary>
/// Sanitize Names
/// </summary>
public static class NameSanitization {

    /// <summary>
    /// Sanitizes the names
    /// </summary>
    /// <param name="input">Name input to sanitize</param>
    /// <returns>Sanitized name</returns>
    public static string SafeName(string? input) {

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