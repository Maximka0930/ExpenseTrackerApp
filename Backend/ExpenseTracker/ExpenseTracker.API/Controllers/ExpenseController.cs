using ExpenseTracker.API.Contracts;
using ExpenseTracker.Core;
using ExpenseTracker.Core.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;
        public ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExpenseResponse>>> GetAllExpenses()
        {
            var expenseEntites = await _expenseService.GetExpenses();
            var response = expenseEntites
                .Select(e => new ExpenseResponse(
                    e.ExpenseId,
                    e.Description,
                    e.Amount,
                    e.ExpenseDate
                ));
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateExpense([FromBody] ExpenseRequest request)
        {
            var expense = Expense.Create(Guid.NewGuid(),request.Description,request.Amount,request.ExpenseDate);
            if(expense.Error == string.Empty)
            {
                var expenseId = await _expenseService.CreateExpense(expense.exp);
                return Ok(expenseId);
            }
            else
            {
                Console.WriteLine(expense.Error);
                return BadRequest(expense.Error);
            }
        }
        [HttpPut("{expenseId:guid}")]
        public async Task<ActionResult<Guid>> UpdateExpense(Guid expenseId, [FromBody] ExpenseRequest request)
        {
            var expId = await _expenseService
                .UpdateExpense(expenseId, 
                request.Description, 
                request.Amount, request.
                ExpenseDate);
            return Ok(expId);
        }
        [HttpDelete("{expenseId:guid}")]
        public async Task<ActionResult<Guid>> DeleteExpense(Guid expenseId)
        {
            var expenseEntites = await _expenseService.GetExpenses();
            var exists = expenseEntites.Any(e => e.ExpenseId == expenseId);
            if (exists)
            {
                var expId = await _expenseService.DeleteExpense(expenseId);
                return Ok(expId);
            }
            else
            {
                Console.WriteLine($"Запись не найдена. Id:{expenseId}");
                return BadRequest($"Запись не найдена. Id:{expenseId}");
            }

        }
    }
}
