// System Utils
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

// App Utils
using api.Utilities;

/// <summary>
/// Create a custom Validation for code
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class ValidCodeAttribute : ValidationAttribute {

    /// <summary>
    /// Validates and sanitizes the input code.
    /// </summary>
    /// <param name="value">Code value to validate</param>
    /// <param name="validationContext">Validation context</param>
    /// <returns>Validation result</returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {

        // Check if the value is null or empty
        if (value == null) {
            return ValidationResult.Success;
        }

        // Sanitize input code (e.g., remove leading/trailing spaces and disallowed characters)
        var sanitizedCode = SanitizeInput(value.ToString()!);

        // If sanitized code is empty after trimming, it's invalid
        if (string.IsNullOrWhiteSpace(sanitizedCode)) {
            return new ValidationResult(Words.Get("CodeMissingOrWrong"));
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// Sanitizes the input code.
    /// Removes leading/trailing spaces and restricts disallowed characters.
    /// </summary>
    /// <param name="input">Code input to sanitize</param>
    /// <returns>Sanitized code</returns>
    private string SanitizeInput(string input) {

        // Trim leading and trailing spaces
        string sanitized = input.Trim();

        // Allow letters, numbers, spaces, and specific special characters: . " ' ! @ / \ 
        sanitized = Regex.Replace(sanitized, @"[^a-zA-Z0-9\s.\""!@/\\']", ""); 

        return sanitized;

    }
}