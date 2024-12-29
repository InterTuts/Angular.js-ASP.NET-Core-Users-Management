// App Utils
using api.Models.Dtos;

// Namespace for Users Repositories
namespace api.Services.Interfaces;

/// <summary>
/// Users Options Interface
/// </summary>
public interface IUsersOptionsRepository {

    /// <summary>
    /// Update a user options
    /// </summary>
    /// <param name="userId">User's ID</param>
    /// <param name="userOptionsDto">User's options</param>
    /// <returns>Return response bool and with message if errors is catched</returns>
    Task<ResponseDto<bool>> UpdateAsync(int userId, UserOptionsDto userOptionsDto);

}