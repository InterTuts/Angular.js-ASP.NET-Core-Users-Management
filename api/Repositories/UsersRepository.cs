// System Utils
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ExtensionsOptions = Microsoft.Extensions.Options;

// App Namespaces
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Models.Entities.Users;
using api.Services.Interfaces;
using api.Utilities.Db;
using api.Utilities;

// Namespace for repositories
namespace api.Repositories;

/// <summary>
/// Users Repository pattern
/// </summary>
/// <param name="_context">Database connection</param>
/// <param name="logger">Logger instance</param>
public class UsersRepository(PostgresSql _context, ILogger<UsersRepository> logger) : IUsersRepository
{
    /// <summary>
    /// Register a user
    /// </summary>
    /// <param name="registrationDto">User dto with the user's data</param>
    public async Task<ResponseDto<UserDto>> RegisterUserAsync(RegistrationDto registrationDto)
    {

        try {

            // Verify if the email is already registered
            if ( _context.Users.Any(db_user => db_user.Email == registrationDto.Email!.Trim()) ) {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("EmailFound")
                };                

            }

            // Init the password hasher
            var passwordHasher = new PasswordHasher<UserEntity>(ExtensionsOptions.Options.Create(new PasswordHasherOptions{CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3}));

            // Init the user entity to use for password hashing
            UserEntity userEntity = new();

            // Init the User entity
            UserEntity entity = new() {                 

                // Set the user's email
                Email = registrationDto.Email!.Trim(),

                // Set the user's password
                Password = passwordHasher.HashPassword(userEntity, registrationDto.Password!.Trim()),

                // Set the joined time
                Created = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds()

            };

            // Verify if social id exists
            if ( registrationDto.SocialId != null ) {
                entity.SocialId = registrationDto.SocialId;
            }

            // Add the entity to the database
            _context.Users.Add(entity);

            // Save the changes
            int saveUser = await _context.SaveChangesAsync();

            // Verify if the user was created
            if ( saveUser > 0 ) {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = new UserDto {
                        UserId = entity.UserId
                    },
                    Message = Words.Get("AccountCreated")
                };  

            } else {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("AccountNotCreated")
                };  
                
            }

        } catch (InvalidOperationException e) {

            // Return response
            return new ResponseDto<UserDto> {
                Result = null,
                Message = e.Message
            };                   

        }

    }

    /// <summary>
    /// Update a user password
    /// </summary>
    /// <param name="userDto">User's data</param>
    /// <returns>Return response bool and with message if errors is catched</returns>
    public async Task<ResponseDto<bool>> UpdatePasswordAsync(UserDto userDto) {

        try {

            // Init the password hasher
            var passwordHasher = new PasswordHasher<UserEntity>(ExtensionsOptions.Options.Create(new PasswordHasherOptions{CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3}));

            // Find the item you want to update
            UserEntity? userData = await _context.Users.FirstOrDefaultAsync(m => m.UserId == userDto.UserId);

            // Verify if the user was found
            if (userData!= null) {

                // Update the item
                userData.Password = passwordHasher.HashPassword(userData, userDto.Password!.Trim());

                // Mark the item as modified
                _context.Entry(userData).State = EntityState.Modified;

                // Save changes to the database
                int passwordUpdated = await _context.SaveChangesAsync();

                // Verify if the password was updated
                if ( passwordUpdated > 0 ) {

                    // Return error response
                    return new ResponseDto<bool> {
                        Result = true,
                        Message = null
                    };

                }

            }

            // Return error response
            return new ResponseDto<bool> {
                Result = false,
                Message = null
            };

        } catch (InvalidOperationException e) {

            // Return error response
            return new ResponseDto<bool> {
                Result = false,
                Message = e.Message
            };                     

        }

    }

    /// <summary>
    /// Check if the user and password is correct
    /// </summary>
    /// <param name="signInDto">User dto with the user's data</param>
    /// <returns>Response with user data</returns>
    public async Task<ResponseDto<UserDto>> SignInAsync(SignInDto signInDto)
    {

        try {

            // Get the user by email
            UserDto? user = await _context.Users
            .Select(m => new UserDto
            {
                UserId = m.UserId,
                Email = m.Email!,
                Password = m.Password!
            })
            .FirstOrDefaultAsync(u => u.Email == signInDto.Email);

            // Verify if the user exists
            if (user == null) {

                // Create the response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("AccountNotFound")
                };

            }

            // Create a UserEntity for password hashing
            UserEntity userEntity = new() {
                Password = user.Password
            };

            // Init the password hasher
            var passwordHasher = new PasswordHasher<UserEntity>(ExtensionsOptions.Options.Create(new PasswordHasherOptions{CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3}));            

            // Verify if password is valid
            var result = passwordHasher.VerifyHashedPassword(userEntity, user.Password ?? string.Empty, signInDto.Password!);

            // Verify if result is Success
            if ( result == PasswordVerificationResult.Success ) {

                // Create the response
                return new ResponseDto<UserDto> {
                    Result = user,
                    Message = Words.Get("SuccessSignIn")
                };

            } else {

                // Create the response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("IncorrectEmailPassword")
                };

            }                

        } catch (InvalidOperationException e) {

            // Logging the exception
            logger.LogError(e, "An error occurred while sign in.");

            // Create the response
            return new ResponseDto<UserDto> {
                Result = null,
                Message = Words.Get("ErrorOccurred")
            };

        }
        
    }

    /// <summary>
    /// Get user data
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>UserDto with user's data</returns>
    public async Task<ResponseDto<UserDto>> GetUserAsync(int userId)
    {

        try {

            // Get the user by id
            UserDto? user = await _context.Users
            .Select(m => new UserDto {
                UserId = m.UserId,
                Email = m.Email,
                Created = m.Created
            })
            .FirstAsync(u => u.UserId == userId);

            // Verify if user exists
            if ( user != null ) {

                // Return the user data
                return new ResponseDto<UserDto> {
                    Result = user,
                    Message = null
                };

            } else {

                // Return the error message
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("AccountNotFound")
                };
                
            }

        } catch ( Exception e ) {

            // Logging the exception
            logger.LogError(e, "An error occurred while user reading options.");

            // Return the error message
            return new ResponseDto<UserDto> {
                Result = null,
                Message = e.Message
            };

        }

    }

    /// <summary>
    /// Get user email
    /// </summary>
    /// <param name="resetDto">User data</param>
    /// <returns>User with email if exists</returns>
    public async Task<ResponseDto<UserDto>> GetUserEmailAsync(EmailDto resetDto) {

        try {

            // Get email from the database
            UserDto? user = await _context.Users
            .Select(m => new UserDto {
                UserId = m.UserId,
                Email = m.Email,
                Password = m.Password,
                Created = m.Created
            })
            .Where(m => m.Email == resetDto.Email)
            .FirstOrDefaultAsync();

            // Check if user exists
            if ( user != null ) {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = user,
                    Message = null
                };

            } else {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("EmailNotFound")
                };

            }

        } catch (InvalidOperationException e) {

            // Return response
            return new ResponseDto<UserDto> {
                Result = null,
                Message = e.Message
            };                   

        }

    }

    /// <summary>
    /// Request user by social id
    /// </summary>
    /// <param name="userDto">User data</param>
    /// <returns>User with email if exists</returns>
    public async Task<ResponseDto<UserDto>> UserBySocialIdAsync(UserDto userDto) {

        try {

            // Get email from the database
            UserDto? user = await _context.Users
            .Select(m => new UserDto {
                UserId = m.UserId,
                Email = m.Email,
                Password = m.Password,
                Created = m.Created,
                SocialId = m.SocialId
            })
            .Where(m => m.SocialId == userDto.SocialId)
            .FirstOrDefaultAsync();

            // Check if user exists
            if ( user != null ) {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = user,
                    Message = null
                };

            } else {

                // Return response
                return new ResponseDto<UserDto> {
                    Result = null,
                    Message = Words.Get("AccountNotFound")
                };

            }

        } catch (InvalidOperationException e) {

            // Return response
            return new ResponseDto<UserDto>
            {
                Result = null,
                Message = e.Message
            };

        }

    }

}