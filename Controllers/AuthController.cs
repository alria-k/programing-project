using FinanceTracker.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(FinanceTrackerDbContext context) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = context.Users.FirstOrDefault(u => u.Email == request.Email);

        if (user == null || user.PasswordHash != request.Password)
        {
            return Unauthorized("Invalid email or password");
        }

        if (!user.IsActive)
        {
            return StatusCode(403, "Account Deactivated.");
        }

        return Ok(new
        {
            token = "fake-jwt-token-for-now",
            user = new
            {
                id = user.Id,
                name = user.Username,
                email = user.Email,
                // .ToLower() ensures the frontend comparison (=== "admin") always works
                role = user.Role.ToLower(),
                isActive = user.IsActive,
                currentSavings = user.CurrentSavings,
                savingsGoal = user.SavingsGoal
            }
        });
    }

    [HttpPatch("update-savings/{id}")]
    public async Task<IActionResult> UpdateSavings(long id, [FromBody] User savingsData)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.CurrentSavings = savingsData.CurrentSavings;
        user.SavingsGoal = savingsData.SavingsGoal;

        await context.SaveChangesAsync(); // Persists to FinanceData.db
        return NoContent();
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        var newUser = new User
        {
            Username = request.Name,
            Email = request.Email,
            PasswordHash = request.Password
        };
        context.Users.Add(newUser);
        context.SaveChanges(); // This saves Gregor to your new .db file
        return Ok();
    }

    [HttpGet("all-users")]
    public async Task<IActionResult> GetAllUsers()
    {
        // Выбираем строго Email и IsActive
        var users = await context.Users
            .Select(u => new { 
                u.Email, 
                u.IsActive 
            })
            .ToListAsync();

        return Ok(users);
    }

    // Data structure to match the frontend form

    [HttpPatch("update-user-profile")]
    public async Task<IActionResult> UpdateUserProfile([FromBody] UserUpdateDto updateData)
    {
        // Find the user by Email (the unique identifier from your frontend)
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == updateData.Email);

        if (user == null) return NotFound("User not found.");

        // 1. Update Account Status
        user.IsActive = updateData.IsActive;

        // 2. Update Name if provided
        if (!string.IsNullOrEmpty(updateData.Name))
        {
            user.Username = updateData.Name;
        }

        // 3. Update Balance (CurrentSavings column in your DB)
        user.CurrentSavings = updateData.Balance;

        await context.SaveChangesAsync();
        return Ok(new { message = "User updated successfully", user });
    }

    [HttpGet("user-details/{email}")]
    public async Task<IActionResult> GetUserDetails(string email)
    {
        var user = await context.Users
            .Select(u => new {
                u.Username,
                u.Email,
                u.Role,
                u.CurrentSavings,
                u.IsActive,
                // We can also count their transactions here
                TransactionCount = context.Transactions.Count(t => t.UserId == u.Id)
            })
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) return NotFound();

        return Ok(user);
    }
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

}

// Helper class to catch the frontend data
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}