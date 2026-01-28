namespace FinanceTracker.Models;

public class UserUpdateDto
{
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
