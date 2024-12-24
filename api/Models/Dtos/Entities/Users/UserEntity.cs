// System Namespaces
using System.ComponentModel.DataAnnotations;

// Define the entities models namespace
namespace api.Models.Entities.Users;

/// <summary>
/// User entity
/// </summary>
public class UserEntity {

    /// <summary>
    /// User's ID field
    /// </summary>
    [Key]
    [Required]
    public int UserId { get; set; }

    /// <summary>
    /// User's email field
    /// </summary>
    [Required]
    [DataType(DataType.EmailAddress)]
    public string? Email { get; set; }

    /// <summary>
    /// User's password field
    /// </summary>
    [DataType(DataType.Text)]
    [MaxLength(250)]
    public string? Password { get; set; }

    /// <summary>
    /// User's social id field
    /// </summary>
    [DataType(DataType.Text)]
    [MaxLength(250)]
    public string? SocialId { get; set; }

    /// <summary>
    /// User's joined time field
    /// </summary>
    [Required]
    public int Created { get; set; }     

}