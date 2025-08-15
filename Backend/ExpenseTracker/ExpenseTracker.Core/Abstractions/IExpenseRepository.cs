using ExpenseTracker.Core;

namespace ExpenseTracker.Core.Abstractions
{
    public interface IExpenseRepository
    {
        Task<Guid> Create(Expense expense);
        Task<Guid> Delete(Guid expenseId);
        Task<List<Expense>> Get();
        Task<Guid> Update(Guid expenseId, string description, decimal amount, DateTime expenseDate);
    }
}