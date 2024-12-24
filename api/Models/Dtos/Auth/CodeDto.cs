// Namespace for Auth Dto
namespace api.Models.Dtos.Auth;

/// <summary>
/// Authorization Dto Class
/// </summary>
public class CodeDto
{
    /// <summary>
    /// User Code Field
    /// </summary>
    [ValidCode]
    public string? Code { get; set; }
}