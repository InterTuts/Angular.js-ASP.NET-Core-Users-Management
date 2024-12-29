// System Utils
using System.ComponentModel.DataAnnotations;

// App Utils
using api.Utilities;
using api.Utilities.Sanitization;

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

        // Remove leading/trailing spaces and disallowed characters
        var sanitizedCode = CodeSanitization.SafeCode(value.ToString()!);

        // If sanitized code is empty after trimming, it's invalid
        if (string.IsNullOrWhiteSpace(sanitizedCode)) {
            return new ValidationResult(Words.Get("CodeMissingOrWrong"));
        }

        return ValidationResult.Success;
    }
    
}