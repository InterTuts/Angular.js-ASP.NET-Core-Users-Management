// System Utils
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

// App Utils
using api.Utilities;

/// <summary>
/// Create a custom validation for name
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class ValidNameAttribute : ValidationAttribute {

    /// <summary>
    /// Validates and sanitizes the input name.
    /// </summary>
    /// <param name="value">Name value to validate</param>
    /// <param name="validationContext">Validation context</param>
    /// <returns>Validation result</returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {

        // Check if the value is null or empty
        if (value == null) {
            return ValidationResult.Success;
        }

        // Sanitize input name (e.g., remove leading/trailing spaces and disallowed characters)
        var sanitizedName = SanitizeInput(value.ToString()!);

        // If sanitized name is empty after trimming, it's invalid
        if (string.IsNullOrWhiteSpace(sanitizedName)) {
            return new ValidationResult(Words.Get("NameMissingOrWrong"));
        }

        // Check if the name is too long
        if (sanitizedName.Length > 50) {
            return new ValidationResult(Words.Get("NameTooLong"));
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// Sanitizes the input name.
    /// Removes leading/trailing spaces and restricts disallowed characters.
    /// </summary>
    /// <param name="input">Name input to sanitize</param>
    /// <returns>Sanitized name</returns>
    private string SanitizeInput(string input) {

        // Trim leading and trailing spaces
        string sanitized = input.Trim();

        // Allow letters, numbers, spaces, and specific special characters: . " ' ! @ / \ 
        sanitized = Regex.Replace(sanitized, @"[^a-zA-Z0-9\s.\""!@/\\']", ""); 

        return sanitized;

    }
}