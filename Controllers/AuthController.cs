using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Models;

namespace FinanceTracker.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(FinanceTrackerDbContext context) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // 1. Look for the user in your database
        var user = context.Users.FirstOrDefault(u => u.Email == request.Email);

        // 2. Simple check (for now, we'll improve security later)
        if (user == null || user.PasswordHash != request.Password)
        {
            return Unauthorized("Invalid email or password");
        }

        // 3. Return the user data the frontend expects
        return Ok(new
        {
            token = "fake-jwt-token-for-now", // We will add real JWT later
            user = new
            {
                name = user.Username,
                email = user.Email,
                role = user.Role,
                isActive = true
            }
        });
    }
}

// Helper class to catch the frontend data
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}