using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Controllers;

[ApiController]
[Route("[controller]")]

public class TransactionController(FinanceTrackerDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await context.Transactions.ToListAsync();
        return Ok(list);
    }

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        var transactions = context.Transactions.ToList();

        var income = transactions.Where(t => t.IsIncome).Sum(t => t.Amount);
        var expenses = transactions.Where(t => !t.IsIncome).Sum(t => t.Amount);

        return Ok(new
        {
            totalBalance = income - expenses,
            totalIncome = income,
            totalExpenses = expenses
        });
    }



    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Transaction transaction)
    {
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();

        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await context.Transactions.FindAsync(id);
        if (transaction == null) return NotFound();

        context.Transactions.Remove(transaction);
        await context.SaveChangesAsync();
        return NoContent();
    }
}