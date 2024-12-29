// Namespace for Dtos
using api.Repositories;
using api.Utilities.Validations;

// Namespace for Dtos
namespace api.Models.Dtos;

/// <summary>
/// User Dto
/// </summary>
public class UserDto
{
    /// <summary>
    /// User's ID field
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// User's First Name field
    /// </summary>
    [ValidName]
    public string? FirstName { get; set; }   

    /// <summary>
    /// User's Last Name field
    /// </summary>
    [ValidName]
    public string? LastName { get; set; }    

    /// <summary>
    /// User's email field
    /// </summary>
    [ValidEmail]
    public string? Email { get; set; }

    /// <summary>
    /// User's password field
    /// </summary>
    [ValidPassword]
    public string? Password { get; set; }

    /// <summary>
    /// Member's role field
    /// </summary>
    public int Role { get; set; }

    /// <summary>
    /// User's social id field
    /// </summary>
    [ValidCode]
    public string? SocialId { get; set; }

    /// <summary>
    /// Joined time
    /// </summary>
    public long Created { get; set; }
    public List<UserOptionDto> Options { get; internal set; }
}