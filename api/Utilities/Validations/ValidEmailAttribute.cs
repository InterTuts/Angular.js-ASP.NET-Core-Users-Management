// System Utils
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using api.Utilities.Sanitization;

// Namespace for Validations
namespace api.Utilities.Validations;

/// <summary>
/// Create a custom Validation for emails
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class ValidEmailAttribute: ValidationAttribute {

    /// <summary>
    /// Validate a received email
    /// </summary>
    /// <param name="value">Should be email</param>
    /// <param name="validationContext">Detailed information about the context</param>
    /// <returns>ValidationResult with success or error message</returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {

        // Verify if email exists
        if (value == null || string.IsNullOrWhiteSpace(value.ToString())) {
            return new ValidationResult(Words.Get("EmailNotValid"));
        }

        // Validate email format
        var email = EmailSanitization.SafeEmail(value.ToString());

        // Verify if email is valid
        if (email != null && !Regex.IsMatch(email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")) {
            return new ValidationResult(Words.Get("EmailNotValid"));
        }

        // Additional checks
        if (email != null && email.Length > 200)
        {
            return new ValidationResult(Words.Get("EmailIsTooLong"));
        }

        // Additional verification with MailAddress
        try {
            _ = new System.Net.Mail.MailAddress(email!);
        } catch {
            return new ValidationResult(Words.Get("EmailNotValid"));
        }

        return ValidationResult.Success;

    }

}