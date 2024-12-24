// Namespace for Dtos
namespace api.Models.Dtos;

/// <summary>
/// A generic type for responses
/// </summary>
public class ResponseDto<T>
{
    /// <summary>
    /// Set response
    /// </summary>
    public required T? Result { get; set; }

    /// <summary>
    /// Message for the response
    /// </summary>
    public required string? Message { get; set; }
}