namespace FinanceTracker.Models;

public class Transaction
{
    public long Id { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsIncome { get; set; } // if income - true, expences - false 
    public DateTime Date { get; set; } = DateTime.Now;
    public long UserId { get; set; }
}