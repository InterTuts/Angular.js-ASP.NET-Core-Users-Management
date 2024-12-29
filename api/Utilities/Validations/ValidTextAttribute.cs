// System Utils
using System.ComponentModel.DataAnnotations;

// App Utils
using api.Utilities;
using api.Utilities.Sanitization;

/// <summary>
/// Create a custom validation for texts
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class ValidTextAttribute : ValidationAttribute {

    /// <summary>
    /// Validates and sanitizes a text.
    /// </summary>
    /// <param name="value">Text value to validate</param>
    /// <param name="validationContext">Validation context</param>
    /// <returns>Validation result</returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {

        // Check if the value is null or empty
        if (value == null) {
            return ValidationResult.Success;
        }

        // Remove leading/trailing spaces and disallowed characters
        var sanitizedText = TextSanitization.SafeText(value.ToString()!);

        // Verify if the text is too long
        if (sanitizedText.Length > 4096) {
            return new ValidationResult(Words.Get("TextTooLong"));
        }

        return ValidationResult.Success;
    }


}