// System Namespaces
using Microsoft.Extensions.Caching.Memory;

// General Utils namespace
namespace api.Utilities;

/// <summary>
/// Caches Manager
/// </summary>
public class Cache {

    /// <summary>
    /// Memory cache container
    /// </summary>
    private readonly IMemoryCache _memoryCache;

    /// <summary>
    /// Members repository constructor
    /// </summary>
    /// <param name="memoryCache">Membery cache instance</param>
    public Cache(IMemoryCache memoryCache) {

        // Save the memory chache
        _memoryCache = memoryCache;

    }

    /// <summary>
    /// Save cache list
    /// </summary>
    /// <param name="cacheGroup">Name of the group</param>
    /// <param name="cacheKey">Name of the cache</param>
    public void Save(string cacheGroup, string cacheKey) {

        // Verify if the cache exists
        if (!_memoryCache.TryGetValue(cacheGroup, out List<string>? values))
        {

            // Create a new list to store cache keys
            values = new List<string>();

        }

        // Add the new cacheKey to the list
        values!.Add(cacheKey);

        // Create the options for cache storing
        MemoryCacheEntryOptions cacheOptions = new()
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
        };

        // Set or update the cache with the new list of values
        _memoryCache.Set(cacheGroup, values, cacheOptions);

    }

    /// <summary>
    /// Remove cache by group
    /// </summary>
    /// <param name="cacheGroup">Name of the group</param>
    public void Remove(string cacheGroup) {

        // Verify if the cache exists
        if (!_memoryCache.TryGetValue(cacheGroup, out List<string>? values))
        {

            // Create a new list to store cache keys
            values = new List<string>();

        }
        
        // check if values exists
        if ( (values != null) && (values.Count > 0) ) {

            // Total values
            int totalValues = values.Count;

            // List the values
            for ( int v = 0; v < totalValues; v++ ) {

                // Delete the cache
                _memoryCache.Remove(values[v]);  

            }

        }

    }

}