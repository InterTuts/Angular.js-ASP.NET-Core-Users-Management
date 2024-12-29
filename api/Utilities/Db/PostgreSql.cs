// System Namespaces
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

// App Utils
using api.Models.Entities.Users;
using api.Options;

// Namespace for Configuration Utils
namespace api.Utilities.Db;

/// <summary>
/// Database connection
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="Db"/> class.
/// </remarks>
/// <param name="options">All App Options.</param>
/// <exception cref="ArgumentNullException">Thrown if <paramref name="options"/> is null.</exception>
public class PostgresSql(IOptions<AppSettings> options) : DbContext {

    /// <summary>
    /// App Settings container.
    /// </summary>
    private readonly AppSettings _options = options.Value ?? throw new ArgumentNullException(nameof(options), Words.Get("OptionsNotFound"));

    /// <summary>
    /// Set the entity for Users
    /// </summary>
    public required DbSet<UserEntity> Users { get; set; } 

    /// <summary>
    /// Set the entity for Users
    /// </summary>
    public required DbSet<UsersOptions> UsersOptions { get; set; } 

    /// <summary>
    /// Users table connection
    /// </summary>
    /// <param name="optionsBuilder">The entity framework settings builder</param>
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {

        // Get the connection string
        string connectionString = _options.ConnectionStrings.DefaultConnection ?? throw new ArgumentNullException(Words.Get("OptionsNotFound"));

        // Set the connection string and connect the database
        optionsBuilder.UseNpgsql(connectionString);

    }

}