// System Utils
using System.ComponentModel.DataAnnotations;

// App Utils
using api.Utilities;
using api.Utilities.Sanitization;

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

        // Remove leading/trailing spaces and disallowed characters
        var sanitizedName = NameSanitization.SafeName(value.ToString()!);

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

}