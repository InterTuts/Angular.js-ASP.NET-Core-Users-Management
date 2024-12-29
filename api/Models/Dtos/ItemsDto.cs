// Namespace for General Dto
namespace api.Models.Dtos;

/// <summary>
/// Search Dto
/// </summary>
public class ItemsDto<T> {

    /// <summary>
    /// Items field
    /// </summary>
    public required List<T> Items { get; set; }

    /// <summary>
    /// Total number field
    /// </summary>
    public int Total { get; set; }        

    /// <summary>
    /// Page number field
    /// </summary>
    public int Page { get; set; }

}