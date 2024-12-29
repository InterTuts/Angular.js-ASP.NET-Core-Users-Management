// App Namespaces
using api.Utilities.Sanitization;

// Namespace for General Dto
namespace api.Models.Dtos;

/// <summary>
/// Search Dto
/// </summary>
public class SearchDto {

    // Search Holder
    private string? _search = "";

    /// <summary>
    /// Search field
    /// </summary>
    [ValidText]
    public string? Search {
        get => _search;
        set => _search = value == null ? null : TextSanitization.SafeText(value);
    }

    /// <summary>
    /// Page number field
    /// </summary>
    public int Page { get; set; }

}