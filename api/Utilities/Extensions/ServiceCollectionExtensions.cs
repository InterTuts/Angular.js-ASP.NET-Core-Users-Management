// System Namespaces
using System.Reflection;

// Namespace for Extensions
namespace api.Utilities.Extensions;

/// <summary>
/// Extension for Services
/// </summary>
public static class ServiceCollectionExtensions
{

    /// <summary>
    /// Register all services
    /// </summary>
    /// <param name="services">Collection with services</param>
    /// <param name="assembly">Represents an assembly</param>
    public static void RegisterRepositories(this IServiceCollection services, Assembly assembly)
    {

        // Get all repositories
        var repositoryTypes = assembly.GetTypes().Where(type =>
            type.IsClass &&
            !type.IsAbstract &&
            type.GetInterfaces().Any(i => i.Name.EndsWith("Repository")));

        // List all repositories
        foreach (var repositoryType in repositoryTypes)
        {
            // Get the interface for a repository
            var interfaceType = repositoryType.GetInterfaces().First(i => i.Name.EndsWith(repositoryType.Name));

            // Inject the repository as service
            services.AddScoped(interfaceType, repositoryType);
        }

    }

}