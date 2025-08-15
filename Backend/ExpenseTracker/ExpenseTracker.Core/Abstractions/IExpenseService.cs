using ExpenseTracker.Core;

namespace ExpenseTracker.Core.Abstractions
{
    public interface IExpenseService
    {
        Task<Guid> CreateExpense(Expense expense);
        Task<Guid> DeleteExpense(Guid expenseId);
        Task<List<Expense>> GetExpenses();
        Task<Guid> UpdateExpense(Guid expenseId, string description, decimal amount, DateTime expenseDate);
    }
}