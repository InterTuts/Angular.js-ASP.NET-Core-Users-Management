// System Utils
using System.ComponentModel.DataAnnotations;

// Namespace for Validations
namespace api.Utilities.Validations;

/// <summary>
/// Create a custom Validation for passwords
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class ValidPasswordAttribute: ValidationAttribute {

    /// <summary>
    /// Validate a received password
    /// </summary>
    /// <param name="value">Should be password</param>
    /// <param name="validationContext">Detailed information about the context</param>
    /// <returns>ValidationResult with success or error message</returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {

        // Verify if password exists
        if (value == null || string.IsNullOrWhiteSpace(value.ToString())) {
            return new ValidationResult(Words.Get("PasswordRequired"));
        }

        // Validate password format
        var password = value.ToString();

        // Verify if password is valid
        if (password!= null && (password.Length < 8 || password.Length > 20)) {
            return new ValidationResult(Words.Get("PasswordLength"));
        }

        return ValidationResult.Success;

    }

}