// System Utils
using System.Text.RegularExpressions;

// Namespace for Account Controllers
namespace api.Utilities.Sanitization;

/// <summary>
/// Sanitize text
/// </summary>
public static class TextSanitization {

    /// <summary>
    /// Sanitizes the texts
    /// </summary>
    /// <param name="input">Text input to sanitize</param>
    /// <returns>Sanitized text</returns>
    public static string SafeText(string? input) {

        // Check if input's value exists
        if ( input == null ) {
            return "";
        }

        // Trim leading and trailing spaces
        string sanitized = input.Trim();

        // Define a whitelist of allowed characters
        string allowedPattern = @"[^a-zA-Z0-9\s.\""!@/\\']";

        // Replace disallowed characters
        sanitized = Regex.Replace(sanitized, allowedPattern, "");

        return sanitized;
        
    }

}