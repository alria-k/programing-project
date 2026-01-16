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

    // Data structure to match the frontend form
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