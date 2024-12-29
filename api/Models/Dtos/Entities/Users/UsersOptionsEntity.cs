// System Namespaces
using System.ComponentModel.DataAnnotations;

// Define the entities models namespace
namespace api.Models.Entities.Users;

/// <summary>
/// User Options entity
/// </summary>
public class UsersOptions {

    /// <summary>
    /// Option's ID field
    /// </summary>
    [Key]
    [Required]
    public int OptionId { get; set; }

    /// <summary>
    /// User's ID field
    /// </summary>
    [Required]
    public int UserId {get; set;}

    /// <summary>
    /// User's option name field
    /// </summary>
    [DataType(DataType.Text)]
    [MaxLength(250)]
    public required string OptionName { get; set; }

    /// <summary>
    /// Option's Value
    /// </summary>
    [DataType(DataType.Text)]
    public string? OptionValue { get; set; }        

}