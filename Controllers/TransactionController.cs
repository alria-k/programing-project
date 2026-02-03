using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Controllers;

[ApiController]
[Route("[controller]")]
public class TransactionController(FinanceTrackerDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] long userId)
    {
        var list = await context.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
        return Ok(list);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(long id)
    {
        var transaction = await context.Transactions.FindAsync(id);
        if (transaction == null) return NotFound();
        return Ok(transaction);
    }

    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id) 
    {
        var transaction = await context.Transactions.FindAsync(id);
        if (transaction == null) return NotFound();

        context.Transactions.Remove(transaction);
        await context.SaveChangesAsync();
        return NoContent();
    }
}