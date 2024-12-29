// System Utils
using Microsoft.EntityFrameworkCore;

// App Namespaces
using api.Models.Dtos;
using api.Services.Interfaces;
using api.Utilities.Db;
using api.Utilities;
using Microsoft.Extensions.Caching.Memory;
using api.Models.Entities.Users;

// Namespace for repositories
namespace api.Repositories;

/// <summary>
/// Users Options Repository pattern
/// </summary>
/// <param name="_context">Database connection</param>
/// <param name="logger">Logger instance</param>
public class UsersOptionsRepository(PostgresSql _context, ILogger<UsersRepository> logger) : IUsersOptionsRepository {

    /// <summary>
    /// Update a user options
    /// </summary>
    /// <param name="userId">User's ID</param>
    /// <param name="userOptionsDto">User's options</param>
    /// <returns>Return response bool and with message if errors is catched</returns>
    public async Task<ResponseDto<bool>> UpdateAsync(int userId, UserOptionsDto userOptionsDto) {

        try {

            // Find the user option by OptionId
            var optionEntity = await _context.UsersOptions
                .FirstOrDefaultAsync(u => u.UserId == userId && u.OptionId == userOptionsDto.Sidebar);

            if (optionEntity != null) {

                // Update the Sidebar property
                optionEntity.OptionValue = userOptionsDto.Sidebar.ToString();

                // Mark as modified and update the entity in the database
                _context.UsersOptions.Update(optionEntity);
                await _context.SaveChangesAsync();

                // Return the response
                return new ResponseDto<bool> {
                    Result = true,
                    Message = Words.Get("UserOptionsSaved")
                };

            } else {

                // Init the User entity
                optionEntity = new() {     

                    // Set the user's id
                    UserId = userId,

                    // Set the option's name
                    OptionName = "Sidebar",

                    // Set the option's value
                    OptionValue = userOptionsDto.Sidebar.ToString()

                };

                // Mark as modified and update the entity in the database
                _context.UsersOptions.Add(optionEntity);
                await _context.SaveChangesAsync();

                // Return the response
                return new ResponseDto<bool> {
                    Result = true,
                    Message = Words.Get("UserOptionsSaved")
                };

            }

        } catch (Exception e) {
            // Logging the exception
            logger.LogError(e, "An error occurred while user updating options.");

            // Return the response
            return new ResponseDto<bool> {
                Result = false,
                Message = Words.Get("UserOptionsNotSaved")
            };                

        }

    }

}