// System Utils
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

// App Namespaces
using api.Options;
using api.Utilities.Db;
using api.Utilities.Extensions;

// App Utils
namespace api;

/// <summary>
/// Startup Class
/// </summary>
/// <param name="configuration">App Configuration</param>
/// <param name="env">Information about the web hosting environment</param>
public class Startup(IConfiguration configuration, IWebHostEnvironment env) {
    /// <summary>
    /// Configuration container
    /// </summary>
    public IConfiguration Configuration { get; } = configuration;

    /// <summary>
    /// Environment container
    /// </summary>
    public IWebHostEnvironment Environment { get; } = env;

    /// <summary>
    /// Configure the app services
    /// </summary>
    /// <param name="services">Collection with services</param>
    public void ConfigureServices(IServiceCollection services) {

        // Register the library for cache storing
        services.AddMemoryCache();

        // Register all repositories
        services.RegisterRepositories(Assembly.GetExecutingAssembly());

        // Configure the session state
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {

            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration.GetValue<string>("AppSettings:JwtSettings:Issuer"),
                ValidAudience = Configuration.GetValue<string>("AppSettings:JwtSettings:Audience"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetValue<string>("AppSettings:JwtSettings:Key") ?? string.Empty))
            };
            
        });

        // Add services for controllers
        services.AddControllers(options => {
            options.Filters.Add<JsonExceptionFilter>();
        })
        .ConfigureApiBehaviorOptions(options => {
            options.InvalidModelStateResponseFactory = context => new BadRequestObjectResult(context.ModelState) {
                ContentTypes = {
                    "application/json"
                },
                StatusCode = 200
            };
        });

        // Add the Cors Service
        services.AddCors(options => {
            options.AddPolicy(name: "MainPolicy",
            policy => {
                policy.WithOrigins(Configuration.GetValue<string>("AppSettings:SiteUrl") ?? string.Empty);
                policy.AllowAnyMethod();
                policy.AllowAnyHeader();
            });
        });             

        // Register the localization for the app's strings
        services.AddLocalization(options => options.ResourcesPath = "Resources");

        // Register the Api version
        services.AddApiVersioning(options => {
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.ReportApiVersions = true;
        });

        // Adds version in url
        services.AddVersionedApiExplorer(options => {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        // Bind app settings to the app settings class
        services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

        // Connect the DB Table Members
        services.AddDbContext<PostgresSql>(options => options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));

        // Add app settings class in the IOptions
        services.AddSingleton(provider => provider.GetRequiredService<IOptions<AppSettings>>().Value);

        // Enable the Controllers support
        services.AddControllers();

    }

    /// <summary>
    /// Configure the HTTP request pipeline
    /// </summary>
    /// <param name="app">Application's request pipeline</param>
    public void Configure(IApplicationBuilder app) {

        // Use the available routes
        app.UseRouting();

        // Set the created Cors policy
        app.UseCors(options => {
            options.WithOrigins(Configuration.GetValue<string>("AppSettings:SiteUrl") ?? string.Empty)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });

        // Enables authentication capabilities
        app.UseAuthentication();        

        // Enables the autorization middleware for requests validation
        app.UseAuthorization();

        // List all endpoints and map the controllers
        app.UseEndpoints(
            endpoints => endpoints.MapControllers()
        );

    }
}
