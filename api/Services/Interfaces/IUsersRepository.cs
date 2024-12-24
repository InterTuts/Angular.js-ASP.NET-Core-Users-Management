// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;

// Namespace for Users Repositories
namespace api.Services.Interfaces;

/// <summary>
/// Users Interface
/// </summary>
public interface IUsersRepository
{
    /// <summary>
    /// Register a user
    /// </summary>
    /// <param name="registrationDto">User dto with the user's data</param>
    /// <returns>Response with user data</returns>
    Task<ResponseDto<UserDto>> RegisterUserAsync(RegistrationDto registrationDto);

    /// <summary>
    /// Update a user password
    /// </summary>
    /// <param name="userDto">User's data</param>
    /// <returns>Return response bool and with message if errors is catched</returns>
    Task<ResponseDto<bool>> UpdatePasswordAsync(UserDto userDto);

    /// <summary>
    /// Check if the user and password is correct
    /// </summary>
    /// <param name="signInDto">User dto with the user's data</param>
    /// <returns>Response with user data</returns>
    Task<ResponseDto<UserDto>> SignInAsync(SignInDto signInDto);

    /// <summary>
    /// Get user data
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>UserDto with user's data</returns>
    Task<ResponseDto<UserDto>> GetUserAsync(int userId);

    /// <summary>
    /// Get user email
    /// </summary>
    /// <param name="resetDto">User data</param>
    /// <returns>User with email if exists</returns>
    Task<ResponseDto<UserDto>> GetUserEmailAsync(EmailDto resetDto);

    /// <summary>
    /// Request user by social id
    /// </summary>
    /// <param name="userDto">User data</param>
    /// <returns>User with email if exists</returns>
    Task<ResponseDto<UserDto>> UserBySocialIdAsync(UserDto userDto);

}