// App namespace
namespace api;

/// <summary>
/// Program class for main entry
/// </summary>
public static class Program
{
    /// <summary>
    /// Main class used as entry point for the app
    /// </summary>
    /// <param name="args">Command-line arguments passed when the application is started</param>
    public static void Main(string[] args)
    {
        // Run the application
        CreateHostBuilder(args).Build().Run();
    }

    /// <summary>
    /// Create the Host and set Startup
    /// </summary>
    /// <param name="args">Command-line arguments passed when the application is started</param>
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
}
